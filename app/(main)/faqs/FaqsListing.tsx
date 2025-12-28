'use client'

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { useRouter } from 'nextjs-toploader/app';
import {
    getAllFaqs,
    getFaqsById,
    postFaqs,
    updateFaqs,
    deleteFaqById,
    postToBulkDestroyFaqs,
} from "@/services/faqs/faqs-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import moment from 'moment';
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import NoDataLottie from "@/public/lottie-files/nodata.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";

function FaqsListing() {
    const router = useRouter();
    const [globalSearch, setGlobalSearch] = useState("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState("");

    // Fetch FAQs data using useInfiniteQuery
    const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["faqs", "paginate", globalSearchTerm],
        queryFn: ({ pageParam = 1 }) => getAllFaqs({ page: pageParam, search: globalSearchTerm, paginate: true }),
        getNextPageParam: (lastPage) => {

            console.log("🚀 ~ FaqsListing ~ lastPageData:", lastPage)
            const lastPageData = lastPage?.data?.data;
            return lastPageData?.current_page < lastPageData?.last_page ? lastPageData.current_page + 1 : undefined;
        },
        initialPageParam: 1,
    });


    useHandleQueryError({ isError });

    // Flatten the paginated data
    const faqsData = data?.pages?.flatMap(page => page?.data?.data?.data) || [];

    // Search function
    const handleSearch = () => {
        setGlobalSearchTerm(globalSearch);
    };

    // Format dates
    const formatDate = (date: any) => (date ? moment(date).format("MMMM Do YYYY") : "N/A");

    return (
        <div className="bg-pattern-two flex justify-center items-center flex-col pb-8 pt-30">
            <div className="w-full md:w-[80%] lg:w-[70%] px-4 py-4">
                {isError ? (
                    <div className="flex justify-center">
                        <div className="max-w-md">
                            <Lottie animationData={SnailErrorLottie} loop autoplay />
                        </div>
                    </div>
                ) : (
                    <Card className="m-3 shadow-md text-gray-800 dark:text-white bg-none">
                        <div className="flex justify-between items-center text-gray-800 dark:text-white">
                            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                        </div>

                        {/* Search Box */}
                        <div className="w-full md:w-[30rem] lg:w-[30rem]">
                            <div className="p-inputgroup">
                                <InputText
                                    type="search"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    placeholder="Search FAQs"
                                />
                                <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
                            </div>
                        </div>


                        {/* FAQs List */}
                        {faqsData.length === 0 && !isLoading ? (
                            <div className="flex justify-center">
                                <div className="max-w-md">
                                    <Lottie animationData={NoDataLottie} loop autoplay />
                                </div>
                            </div>
                        ) : (
                            <div className="my-4">
                                {faqsData.map((faq, index) => (
                                    <Panel key={index} header={faq.question} toggleable collapsed={true} className="text-gray-800 dark:text-white m-1">
                                        <p>{faq.answer}</p>
                                        <small className="text-500">Created at: {formatDate(faq.created_at)}</small>
                                    </Panel>
                                ))}
                            </div>
                        )}


                        {/* Loading Spinner */}
                        {isLoading && (
                            <div className="flex justify-center items-center p-4">
                                <ProgressSpinner style={{ width: "30px", height: "30px" }} />
                                <span className="ml-2">Loading data...</span>
                            </div>
                        )}

                        {/* Load More Button */}
                        {/* {hasNextPage && (
                        <div className="flex justify-center mt-3">
                            <Button
                                label="Load More"
                                severity="info"
                                icon="pi pi-refresh"
                                loading={isLoading}
                                onClick={() => fetchNextPage()}
                            />
                        </div>
                    )} */}

                        {hasNextPage && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    label={isFetchingNextPage ? "Loading more data..." : "Load More"}
                                    className="p-button-outlined"
                                    icon={isFetchingNextPage ? "pi pi-spinner pi-spin" : ""}
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                />
                            </div>
                        )}

                        {!hasNextPage && (
                            <div className="flex justify-center my-4">
                                <Button label="End" className="p-button-secondary" disabled />
                            </div>
                        )}


                    </Card>
                )}

            </div>
        </div>
    );
}

export default FaqsListing;
