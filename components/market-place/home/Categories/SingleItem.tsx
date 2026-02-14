import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: any }) => {
    const imageUrl =
        item?.category_attachments?.find((att: any) => att.featured)?.file_path ||
        item?.category_attachments?.[0]?.file_path ||
        item?.image;

    return (
        <Link href={`/category/${item.id}`} className="group flex flex-col items-center">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[130px] lg:h-[130px] rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10 dark:group-hover:bg-primary/20">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.name || "Category"}
                        width={82}
                        height={62}
                        className="object-contain"
                    />
                ) : (
                    <span className="text-3xl text-gray-400 dark:text-gray-500">📦</span>
                )}
            </div>

            <h3 className="font-medium text-sm sm:text-base text-center text-dark dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {item.name}
            </h3>
        </Link>
    );
};

export default SingleItem;