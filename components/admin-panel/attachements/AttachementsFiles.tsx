import React, { JSX } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { FiDownload, FiFile, FiImage, FiVideo, FiMusic, FiFileText, FiAlertCircle } from "react-icons/fi";

// =================== TYPE DEFINITIONS ===================
type Attachment = {
    file_path: string;
    caption?: string;
};

type FileCategory = "image" | "video" | "audio" | "document" | "other";

type FeedbackAttachmentsProps = {
    attachments: Attachment[] | null;
};

// =================== COMPONENT ===================
const FeedbackAttachments: React.FC<FeedbackAttachmentsProps> = ({ attachments }) => {
    // =================== FILE EXTENSION DEFINITIONS ===================
    const imageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const videoExtensions: string[] = ["mp4", "webm", "ogg", "hevc", "h265", "mov", "avi", "mkv", "flv", "wmv"];
    const audioExtensions: string[] = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"];
    const documentExtensions: string[] = ["pdf"];

    // Non-previewable formats (need download)
    const nonPreviewableVideoFormats: string[] = ["hevc", "h265", "mov", "avi", "mkv", "flv", "wmv"];
    const nonPreviewableImageFormats: string[] = ["heic", "heif", "raw", "cr2", "nef", "arw"];

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

    const isPreviewableVideo = (filePath: string): boolean => {
        const ext = getFileExtension(filePath);
        return !nonPreviewableVideoFormats.includes(ext) && ["mp4", "webm", "ogg"].includes(ext);
    };

    const isPreviewableImage = (filePath: string): boolean => {
        const ext = getFileExtension(filePath);
        return !nonPreviewableImageFormats.includes(ext) && imageExtensions.includes(ext);
    };

    // =================== RENDER ATTACHMENT FUNCTION ===================
    const renderAttachment = (attachment: Attachment): JSX.Element => {
        const { file_path, caption } = attachment;
        const fileName = getFileName(file_path);
        const fileUrl = `${file_path}`;
        const fileExt = getFileExtension(file_path).toUpperCase();
        const category = getFileCategory(file_path);

        // Handle Images
        if (category === "image") {
            if (isPreviewableImage(file_path)) {
                return (
                    <div className="bg-white rounded-lg shadow-lg p-3">
                        <Image
                            src={fileUrl}
                            alt={fileName}
                            className="w-full md:w-40 lg:w-60 rounded-md mb-3 object-cover"
                            preview
                        />
                        <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                            {caption}
                        </p>
                        <Button
                            label="Download"
                            icon={<FiDownload className="mr-2" />}
                            className="w-full p-button-sm"
                            onClick={() => window.open(fileUrl, "_blank")}
                        />
                    </div>
                );
            } else {
                return (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                        <FiImage size={56} className="text-gray-400 mb-3 mx-auto" />
                        <p className="text-base font-semibold mb-3" title={fileName}>
                            {fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName}
                        </p>
                        <span className="inline-flex items-center justify-center px-3 py-2 rounded bg-purple-100 text-purple-700 text-sm mb-3">
                            {fileExt}
                        </span>
                        {caption && (
                            <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                                {caption}
                            </p>
                        )}
                        <p className="text-sm text-gray-600 mb-4">Cannot preview in browser</p>
                        <Button
                            label="Download to View"
                            icon={<FiDownload className="mr-2" />}
                            severity="secondary"
                            onClick={() => window.open(fileUrl, "_blank")}
                        />
                    </div>
                );
            }
        }

        // Handle Videos
        if (category === "video") {
            if (isPreviewableVideo(file_path)) {
                return (
                    <div className="bg-white rounded-lg shadow-lg p-3 flex flex-col items-center justify-center">
                        <video className="w-full rounded-md mb-3" style={{ maxWidth: "300px" }} controls>
                            <source src={fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div style={{ width: "100%" }} className="text-center overflow-hidden">
                            <p className="text-sm text-gray-600 mb-2 truncate" title={fileName}>
                                {fileName}
                            </p>
                            {caption && (
                                <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                                    {caption}
                                </p>
                            )}
                        </div>
                        <Button
                            label="Download"
                            icon={<FiDownload className="mr-2" />}
                            className="w-full p-button-sm"
                            severity="danger"
                            onClick={() => window.open(fileUrl, "_blank")}
                        />
                    </div>
                );
            } else {
                return (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                        <FiVideo size={56} className="text-gray-400 mb-3 mx-auto" />
                        <p className="text-base font-semibold mb-3" title={fileName}>
                            {fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName}
                        </p>
                        <span className="inline-flex items-center justify-center px-3 py-2 rounded bg-red-100 text-red-700 text-sm mb-3">
                            {fileExt}
                        </span>
                        {caption && (
                            <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                                {caption}
                            </p>
                        )}
                        <p className="text-sm text-gray-600 mb-4">Cannot preview in browser</p>
                        <Button
                            label="Download to View"
                            icon={<FiDownload className="mr-2" />}
                            severity="danger"
                            onClick={() => window.open(fileUrl, "_blank")}
                        />
                    </div>
                );
            }
        }

        // Handle Audio
        if (category === "audio") {
            return (
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <FiMusic className="text-green-500" size={28} />
                        <p className="text-base font-medium m-0 grow truncate" title={fileName}>
                            {fileName}
                        </p>
                    </div>
                    {caption && (
                        <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                            {caption}
                        </p>
                    )}
                    <audio controls className="w-full mb-4">
                        <source src={fileUrl} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                    <Button
                        label="Download"
                        icon={<FiDownload className="mr-2" />}
                        className="w-full p-button-sm"
                        severity="success"
                        onClick={() => window.open(fileUrl, "_blank")}
                    />
                </div>
            );
        }

        // Handle Documents (PDF)
        if (category === "document") {
            return (
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center bg-red-100 rounded-lg p-3">
                            <FiFileText className="text-red-600" size={32} />
                        </div>
                        <div className="grow overflow-hidden">
                            <p className="text-base font-semibold mb-1 truncate" title={fileName}>
                                {fileName}
                            </p>
                            <span className="text-sm text-gray-600">PDF Document</span>
                        </div>
                        <Button
                            label="Open"
                            icon={<FiDownload className="mr-2" />}
                            severity="danger"
                            onClick={() => window.open(fileUrl, "_blank")}
                        />
                    </div>
                    {caption && (
                        <p className="text-sm text-gray-600 mt-2 truncate" title={caption}>
                            {caption}
                        </p>
                    )}
                </div>
            );
        }

        // Default: Other files
        return (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                <FiFile size={56} className="text-gray-400 mb-3 mx-auto" />
                <p className="text-base font-semibold mb-3" title={fileName}>
                    {fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName}
                </p>
                <div>
                    <span className="inline-flex items-center justify-center px-3 py-2 rounded bg-gray-100 text-gray-700 text-sm mb-3">
                        {fileExt || "UNKNOWN"}
                    </span>
                </div>
                {caption && (
                    <p className="text-sm text-gray-600 mb-3 truncate" title={caption}>
                        {caption}
                    </p>
                )}
                <Button
                    label="Download"
                    icon={<FiDownload className="mr-2" />}
                    severity="secondary"
                    onClick={() => window.open(fileUrl, "_blank")}
                />
            </div>
        );
    };

    // =================== EMPTY STATE ===================
    if (!attachments || attachments.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                <FiAlertCircle size={64} className="text-gray-400 mb-4 mx-auto" />
                <p className="text-lg text-gray-600 font-medium m-0">No attachments available</p>
                <p className="text-sm text-gray-600 mt-2 m-0">This feedback has no attached files</p>
            </div>
        );
    }

    // =================== CATEGORIZE ATTACHMENTS BY EXTENSION ===================
    const pictures = attachments.filter((a) => getFileCategory(a.file_path) === "image");
    const videos = attachments.filter((a) => getFileCategory(a.file_path) === "video");
    const audio = attachments.filter((a) => getFileCategory(a.file_path) === "audio");
    const documents = attachments.filter((a) => getFileCategory(a.file_path) === "document");
    const others = attachments.filter((a) => getFileCategory(a.file_path) === "other");

    // =================== RENDER COMPONENT ===================
    return (
        <div>
            {/* Header with file count */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FiFileText className="text-blue-600" size={28} />
                    <div>
                        <h3 className="text-xl font-bold m-0 mb-1">Files</h3>
                        <p className="text-base text-gray-600 m-0">
                            {attachments.length} file{attachments.length !== 1 ? "s" : ""} attached
                        </p>
                    </div>
                </div>
            </div>

            {/* Accordion sections by file type */}
            <Accordion multiple>
                {/* Pictures Section */}
                {pictures.length > 0 && (
                    <AccordionTab
                        header={
                            <div className="flex items-center gap-1">
                                <FiImage className="text-purple-500" size={22} />
                                <span className="font-bold text-base">Pictures</span>
                                <span className="ml-auto bg-purple-100 text-purple-700 rounded px-3 py-1 text-base font-semibold">
                                    {pictures.length}
                                </span>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {pictures.map((attachment, index) => (
                                <div key={index}>
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                    </AccordionTab>
                )}

                {/* Videos Section */}
                {videos.length > 0 && (
                    <AccordionTab
                        header={
                            <div className="flex items-center gap-1">
                                <FiVideo className="text-red-500" size={22} />
                                <span className="font-bold text-base">Videos</span>
                                <span className="ml-auto bg-red-100 text-red-700 rounded px-3 py-1 text-base font-semibold">
                                    {videos.length}
                                </span>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {videos.map((attachment, index) => (
                                <div key={index} className="flex-1 min-w-[280px] max-w-[calc(50%-0.375rem)]">
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                    </AccordionTab>
                )}

                {/* Audio Section */}
                {audio.length > 0 && (
                    <AccordionTab
                        header={
                            <div className="flex items-center gap-1">
                                <FiMusic className="text-green-500" size={22} />
                                <span className="font-bold text-base">Audio</span>
                                <span className="ml-auto bg-green-100 text-green-700 rounded px-3 py-1 text-base font-semibold">
                                    {audio.length}
                                </span>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {audio.map((attachment, index) => (
                                <div key={index} className="flex-1 min-w-[280px] max-w-[calc(50%-0.375rem)]">
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                    </AccordionTab>
                )}

                {/* Documents Section */}
                {documents.length > 0 && (
                    <AccordionTab
                        header={
                            <div className="flex items-center gap-1">
                                <FiFileText className="text-orange-500" size={22} />
                                <span className="font-bold text-base">Documents</span>
                                <span className="ml-auto bg-orange-100 text-orange-700 rounded px-3 py-1 text-base font-semibold">
                                    {documents.length}
                                </span>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {documents.map((attachment, index) => (
                                <div key={index} className="flex-1 min-w-[280px] max-w-[calc(50%-0.375rem)]">
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                    </AccordionTab>
                )}

                {/* Other Files Section */}
                {others.length > 0 && (
                    <AccordionTab
                        header={
                            <div className="flex items-center gap-1">
                                <FiFile className="text-gray-600" size={22} />
                                <span className="font-bold text-base">Other Files</span>
                                <span className="ml-auto bg-gray-200 text-gray-700 rounded px-3 py-1 text-base font-semibold">
                                    {others.length}
                                </span>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {others.map((attachment, index) => (
                                <div key={index} className="flex-1 min-w-[280px] max-w-[calc(50%-0.375rem)]">
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                    </AccordionTab>
                )}
            </Accordion>
        </div>
    );
};

export default FeedbackAttachments;