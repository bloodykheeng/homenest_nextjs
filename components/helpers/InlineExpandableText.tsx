'use client'
import React, { useState, MouseEvent } from "react";

const InlineExpandableText = ({ text = "", maxLength }: { text: string | null, maxLength: number }) => {
    const textString = text ?? ""
    const [expanded, setExpanded] = useState(false);

    // Click handler to toggle text expansion
    const toggleText = (e: MouseEvent) => {
        e.preventDefault();
        setExpanded(!expanded)
    };

    // Conditional style
    const toggleStyle = textString.length > maxLength ? { cursor: "pointer", whiteSpace: "pre-wrap" } : { whiteSpace: "pre-wrap" };

    return (
        <span>
            {expanded ? (
                <span style={toggleStyle} onClick={toggleText}>
                    {textString}{" "}
                </span>
            ) : (
                <span style={toggleStyle} onClick={toggleText}>
                    {textString.length > maxLength ? `${textString.substring(0, maxLength)}...` : textString}{" "}
                </span>
            )}
        </span>
    );
};

export default InlineExpandableText;
