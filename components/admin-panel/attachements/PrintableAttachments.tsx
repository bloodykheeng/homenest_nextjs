import React, { JSX } from 'react';
import Image from "next/image";

// =================== TYPE DEFINITIONS ===================
type Attachment = {
    file_path: string;
    caption?: string;
};

type FileCategory = "image" | "video" | "audio" | "document" | "other";

interface PrintableAttachmentsPropTypes {
    attachementsData: Attachment[] | null;
    title?: string;
}

// =================== COMPONENT ===================
function PrintableAttachments({ title = "Attachments", attachementsData = [] }: PrintableAttachmentsPropTypes) {
    // =================== FILE EXTENSION DEFINITIONS ===================
    const imageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const videoExtensions: string[] = ["mp4", "webm", "ogg", "hevc", "h265", "mov", "avi", "mkv", "flv", "wmv"];
    const audioExtensions: string[] = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"];
    const documentExtensions: string[] = ["pdf"];

    // =================== UTILITY FUNCTIONS ===================
    const getFileName = (filePath: string): string => {
        return filePath?.split("/").pop() || "Download File";
    };

    const getFileExtension = (filePath: string): string => {
        return filePath?.substring(filePath.lastIndexOf(".") + 1).toLowerCase() || "";
    };

    // Determine file category based on extension
    const getFileCategory = (filePath: string): FileCategory => {
        const ext = getFileExtension(filePath);

        if (imageExtensions.includes(ext)) return "image";
        if (videoExtensions.includes(ext)) return "video";
        if (audioExtensions.includes(ext)) return "audio";
        if (documentExtensions.includes(ext)) return "document";

        return "other";
    };

    // Check if there are no attachments
    const noAttachments = !attachementsData || attachementsData.length === 0;

    // =================== CATEGORIZE ATTACHMENTS BY EXTENSION ===================
    const pictures = attachementsData?.filter((att) => getFileCategory(att.file_path) === "image") || [];
    const audioFiles = attachementsData?.filter((att) => getFileCategory(att.file_path) === "audio") || [];
    const videos = attachementsData?.filter((att) => getFileCategory(att.file_path) === "video") || [];
    const documents = attachementsData?.filter((att) => getFileCategory(att.file_path) === "document") || [];
    const others = attachementsData?.filter((att) => getFileCategory(att.file_path) === "other") || [];

    // =================== RENDER ATTACHMENT FUNCTION ===================
    // Function to determine the attachment type and render accordingly for printing
    const renderPrintableAttachment = (attachment: Attachment): JSX.Element => {
        const { file_path, caption } = attachment;
        const fileName = getFileName(file_path);
        const category = getFileCategory(file_path);
        const fullPath = `${file_path}`;

        // For images, render the actual image with caption
        if (category === "image") {
            return (
                <div className="flex flex-col items-center p-2 break-inside-avoid">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fullPath}
                        alt={caption || "Image attachment"}
                        className="max-w-full h-auto max-h-64 object-contain"
                    />
                    {/* <Image
                        src={fullPath}
                        alt={caption || "Image attachment"}
                        width={300}
                        height={200}
                        className="w-auto h-auto max-h-64 border border-gray-200 object-contain"
                    /> */}
                    {caption && <p className="mt-2 text-sm text-gray-600 text-center">{caption}</p>}
                    {/* <p className="text-xs text-gray-400 mt-1">{fileName}</p> */}
                </div>
            );
        }

        // For all other types, just show the file path and caption
        return (
            <div className="flex flex-col p-2 break-inside-avoid">
                <div className="flex items-center">
                    {/* File type icon */}
                    <div className="mr-2">
                        {category === "video" && (
                            <div className="w-8 h-8 bg-red-100 flex items-center justify-center rounded-full">
                                <span className="text-red-500 text-xs">VIDEO</span>
                            </div>
                        )}
                        {category === "audio" && (
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-full">
                                <span className="text-blue-500 text-xs">AUDIO</span>
                            </div>
                        )}
                        {category === "document" && (
                            <div className="w-8 h-8 bg-amber-100 flex items-center justify-center rounded-full">
                                <span className="text-amber-500 text-xs">DOC</span>
                            </div>
                        )}
                        {category === "other" && (
                            <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-full">
                                <span className="text-gray-500 text-xs">FILE</span>
                            </div>
                        )}
                    </div>

                    {/* File name and path */}
                    <div className="flex-1">
                        <p className="font-medium text-sm">{fileName}</p>
                        <p className="text-xs text-gray-500 break-all">{fullPath}</p>
                    </div>
                </div>

                {/* Caption */}
                {caption && <p className="mt-2 text-sm text-gray-600 pl-10">{caption}</p>}
            </div>
        );
    };

    // =================== RENDER SECTION FUNCTION ===================
    // Render a section for each type of attachment
    const renderAttachmentSection = (sectionTitle: string, items: Attachment[]): JSX.Element | null => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6 break-inside-avoid-page">
                <h4 className="text-lg font-semibold mb-2 border-b pb-1">{sectionTitle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                    {items?.map((attachment, index) => (
                        <div key={index} className="border rounded p-2">
                            {renderPrintableAttachment(attachment)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // =================== RENDER COMPONENT ===================
    return (
        <div className="print-attachments py-4">
            <h4 className="text-sm font-bold mb-4">{title}</h4>

            {noAttachments ? (
                <p className="text-gray-500 italic">No {title} available</p>
            ) : (
                <div className="space-y-6">
                    {renderAttachmentSection("Pictures", pictures)}
                    {renderAttachmentSection("Audio Files", audioFiles)}
                    {renderAttachmentSection("Videos", videos)}
                    {renderAttachmentSection("Documents", documents)}
                    {renderAttachmentSection("Other Files", others)}
                </div>
            )}
        </div>
    );
}

export default PrintableAttachments;