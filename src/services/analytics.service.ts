import Contact from "../models/contact.model.js";
import Order from "../models/order.model.js";
import Ticket from "../models/ticket.model.js";

export async function getTotalRevenue(history: boolean = false) {
    const totalRevenue = await Order.aggregate(
        [
            { $unwind: "$products" },
            {
                $match: {
                    createdAt: {
                        $gte: history
                            ? new Date(
                                new Date().setMonth(
                                    new Date().getMonth() - 12
                                )
                            )
                            : new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            ),
                        $lte: history
                            ? new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            )
                            : new Date()
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$products.unitPrice",
                                "$products.quantity"
                            ]
                        }
                    }
                }
            }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    if(totalRevenue.length === 0) return 0;
    return totalRevenue[0].totalRevenue;
}

export async function getNumberOfOrders(history: boolean = false) {
    const numberOfOrders = await Order.aggregate(
        [
            {
                $match: {
                    createdAt: {
                        $gte: history
                            ? new Date(
                                new Date().setMonth(
                                    new Date().getMonth() - 12
                                )
                            )
                            : new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            ),
                        $lte: history
                            ? new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            )
                            : new Date()
                    }
                }
            },
            { $count: "totalOrders" }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    if(numberOfOrders.length === 0) return 0;
    return numberOfOrders[0].totalOrders;
}

export async function getConversionRate(history: boolean = false) {
    const conversionRate = await Contact.aggregate(
        [
            {
                $match: {
                    createdAt: {
                        $gte: history
                            ? new Date(
                                new Date().setMonth(
                                    new Date().getMonth() - 12
                                )
                            )
                            : new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            ),
                        $lte: history
                            ? new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            )
                            : new Date()
                    }
                }
            },
            {
                $facet: {
                    twoStages: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $size: "$stage" }, 2]
                                }
                            }
                        },
                        { $count: "count" }
                    ],
                    oneStage: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $size: "$stage" }, 1]
                                }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    two: {
                        $arrayElemAt: ["$twoStages.count", 0]
                    },
                    one: {
                        $arrayElemAt: ["$oneStage.count", 0]
                    }
                }
            },
            {
                $project: {
                    percentage: {
                        $multiply: [{ $divide: ["$two", "$one"] }, 100]
                    }
                }
            }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    if(conversionRate.length === 0) return 0;
    return conversionRate[0].percentage;
}

export async function getCancellationRate(history: boolean = false) {
    const cancellationRate = await Order.aggregate(
        [
            {
                $match: {
                    createdAt: {
                        $gte: history
                            ? new Date(
                                new Date().setMonth(
                                    new Date().getMonth() - 12
                                )
                            )
                            : new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            ),
                        $lte: history
                            ? new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            )
                            : new Date()
                    }
                }
            },
            {
                $facet: {
                    cancelledOrders: [
                        {
                            $match: {
                                "stage.stageType": "Cancelled"
                            }
                        },
                        { $count: "count" }
                    ],
                    nonCancelledOrders: [
                        {
                            $match: {
                                "stage.stageType": {
                                    $ne: "cancelled"
                                }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    percentCancelled: {
                        $multiply: [
                            {
                                $divide: [
                                    {
                                        $arrayElemAt: [
                                            "$cancelledOrders.count",
                                            0
                                        ]
                                    },
                                    {
                                        $arrayElemAt: [
                                            "$nonCancelledOrders.count",
                                            0
                                        ]
                                    }
                                ]
                            },
                            100
                        ]
                    }
                }
            }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    if(cancellationRate.length === 0) return 0;
    return cancellationRate[0].percentCancelled;
}

export async function getRevenueData() {
    const revenueData = await Order.aggregate(
        [
            { $unwind: "$products" },
            {
                $group: {
                    _id: {
                        monthNumber: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: {
                        $sum: {
                            $multiply: [
                                "$products.unitPrice",
                                "$products.quantity"
                            ]
                        }
                    },
                    orders: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    month: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 1]
                                    },
                                    then: "Jan"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 2]
                                    },
                                    then: "Feb"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 3]
                                    },
                                    then: "Mar"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 4]
                                    },
                                    then: "Apr"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 5]
                                    },
                                    then: "May"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 6]
                                    },
                                    then: "Jun"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 7]
                                    },
                                    then: "Jul"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 8]
                                    },
                                    then: "Aug"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 9]
                                    },
                                    then: "Sep"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 10]
                                    },
                                    then: "Oct"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 11]
                                    },
                                    then: "Nov"
                                },
                                {
                                    case: {
                                        $eq: ["$_id.monthNumber", 12]
                                    },
                                    then: "Dec"
                                }
                            ],
                            default: "Unknown"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    monthNumber: "$_id.monthNumber",
                    year: "$_id.year",
                    month: 1,
                    revenue: 1,
                    orders: 1
                }
            }
        ],
        { maxTimeMS: 60000 }
    )
        .allowDiskUse(true)
        .exec();

    if(revenueData.length === 0) return [];
    return revenueData;
}

export async function getTicketData() {
    const ticketData = await Ticket.aggregate(
        [
            {
                $facet: {
                    open: [
                        {
                            $match: {
                                status: { $size: 1 },
                                "status.0.statusType": "New"
                            }
                        },
                        { $count: "value" },
                        {
                            $addFields: {
                                status: "open",
                                name: "Open"
                            }
                        }
                    ],
                    pending: [
                        {
                            $match: {
                                status: {
                                    $elemMatch: {
                                        statusType: { $ne: "Closed" }
                                    }
                                }
                            }
                        },
                        { $count: "value" },
                        {
                            $addFields: {
                                status: "pending",
                                name: "Pending"
                            }
                        }
                    ],
                    closed: [
                        {
                            $match: {
                                status: {
                                    $elemMatch: {
                                        statusType: "Closed"
                                    }
                                }
                            }
                        },
                        { $count: "value" },
                        {
                            $addFields: {
                                status: "closed",
                                name: "Closed"
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    result: {
                        $concatArrays: ["$open", "$pending", "$closed"]
                    }
                }
            },
            { $unwind: "$result" },
            { $replaceRoot: { newRoot: "$result" } }
        ],
        { maxTimeMS: 60000 }
    )
        .allowDiskUse(true)
        .exec();

    return ticketData;
}

export async function getProductData() {
    const productData = await Order.aggregate(
        [
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.name",
                    sales: { $sum: "$products.quantity" },
                    revenue: {
                        $sum: {
                            $multiply: [
                                "$products.quantity",
                                "$products.unitPrice"
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    sales: 1,
                    revenue: 1
                }
            },
            { $sort: { sales: -1 } }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    return productData;
}

export async function getLeadData() {
    const leadData = await Contact.aggregate(
        [
            {
                $group: {
                    _id: {
                        owner: "$owner",
                        stagesCount: { $size: "$stage" }
                    },
                    totalContacts: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.owner",
                    leadsHandled: { $sum: "$totalContacts" },
                    conversions: {
                        $sum: {
                            $cond: [
                                { $eq: ["$_id.stagesCount", 2] },
                                "$totalContacts",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    employeeId: "$_id",
                    conversions: 1,
                    leadsHandled: 1,
                    conversionRate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$leadsHandled", 0] },
                                    0,
                                    {
                                        $divide: [
                                            "$conversions",
                                            "$leadsHandled"
                                        ]
                                    }
                                ]
                            },
                            100
                        ]
                    }
                }
            }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    return leadData;
}
