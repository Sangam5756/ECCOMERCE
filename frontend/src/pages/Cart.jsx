import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import { DisplayInrCurrency } from "../helpers/DisplayCurreny";
import Context from "../context";

const Cart = () => {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const Generalcontext = useContext(Context);
    const loadingCart = new Array(Generalcontext.cartProductCount).fill(null);

    const fetchData = async () => {
        setLoading(true);
        const response = await axios.get(SummaryApi.view_addtoCart.url, {
            withCredentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response?.data.success) {
            setData(response?.data?.data);
        }
        setLoading(false);
    };

    console.log("cartData", data);



    useEffect(() => {
        fetchData();
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await axios.post(SummaryApi.update_addtoCart.url, {
            quantity: qty + 1
        }, {
            withCredentials: 'include',
            headers: {
                "Content-Type": "Application/json"
            }
        })

        if (response.data.success) {
            fetchData()
        }

        console.log(response)
    }
    const decreaseQty = async (id, qty) => {
        const response = await axios.post(SummaryApi.update_addtoCart.url, {
            quantity: qty - 1
        }, {
            withCredentials: 'include',
            headers: {
                "Content-Type": "Application/json"
            }
        })
        console.log(response)
        if (response.data.success) {
            fetchData()
        }


    }

    return (
        <div className="container mx-auto ">
            <div className="text-center text-lg my-3">
                {data.length === 0 && !loading && (
                    <p className="bg-white py-5">No Product in Cart</p>
                )}
            </div>

            <div className="flex  flex-col lg:flex-row gap-10 lg:justify-between">
                {/* View Product */}
                <div className="w-full max-w-3xl p-4">
                    {loading
                        ? loadingCart.map((el) => {
                            return (
                                <div className="w-full bg-slate-300 h-32 my-2 border-slate-300 animate-pulse rounded "></div>
                            );
                        })
                        : data.map((product, index) => {
                            return (
                                <div
                                    key={product?.productId.productId}
                                    className="w-full bg-slate-200 h-32 my-2 border-slate-300  rounded grid grid-cols-[128px,1fr] "
                                >
                                    <div className="w-32 h-32 bg-slate-300">
                                        <img
                                            src={product.productId.productImage[0]}
                                            alt=""
                                            className="w-full h-full  object-scale-down mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="px-4 py-2">
                                        <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                                            {product?.productId?.productName}
                                        </h2>
                                        <p className=" capitalize text-slate-500">
                                            {product.productId.category}
                                        </p>
                                        <p className="text-red-600 font-medium text-lg">
                                            {DisplayInrCurrency(product?.productId.sellingPrice)}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <button onClick={() => decreaseQty(product?.productId?._id, product.quantity)} className="border border-red-600 text-red-500  h-6 w-6 rounded flex items-center justify-center hover:bg-red-600 hover:text-white">

                                                -
                                            </button>
                                            <span>&nbsp;&nbsp;{product.quantity} &nbsp;&nbsp;</span>
                                            <button onClick={() => increaseQty(product?.productId?._id, product.quantity)} className=" border border-red-600 text-red-500 h-6 w-6  flex items-center justify-center rounded hover:bg-red-600 hover:text-white">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Summary */}
                <div className="mt-5 lg:mt-0 w-full max-w-sm p-4 ">
                    {loading ? (
                        <div className=" h-36 bg-slate-200 border border-slate-300 animate-pulse">
                            Total
                        </div>
                    ) : (
                        <div className=" h-36 bg-slate-200">Total</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;