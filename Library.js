// notebook.js - JavaScript specific to notebook.html

document.addEventListener('DOMContentLoaded', () => {
    console.log('Notebook page loaded.');

    // Set body background to off-white by default (ensures background image is applied)
    document.body.classList.add('off-white-bg');

    const libraryContainer = document.querySelector('.library-container');
    const timerDisplay = document.querySelector('.timer-display');
    let timerInterval = null;
    let timerSeconds = 5;

    if (libraryContainer && timerDisplay) {
        libraryContainer.addEventListener('mouseenter', () => {
            timerSeconds = 5; // Reset timer
            timerDisplay.textContent = `${timerSeconds}s`;
            timerDisplay.style.opacity = '1';
            timerDisplay.style.visibility = 'visible';

            // Clear any existing interval
            if (timerInterval) {
                clearInterval(timerInterval);
            }

            timerInterval = setInterval(() => {
                timerSeconds--;
                timerDisplay.textContent = `${timerSeconds}s`;

                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;

                    // Fade out sections
                    const stationSection = document.getElementById('train-station-square');
                    const librarySection = document.querySelector('.library-entrance-area');
                    if (stationSection) stationSection.classList.add('fade-out');
                    if (librarySection) librarySection.classList.add('fade-out');

                    // Hide timer as well
                    timerDisplay.style.opacity = '0';
                    timerDisplay.style.visibility = 'hidden';

                    // Wait for fade-out transition (0.5s) then fade in reading section
                    setTimeout(() => {
                        const readingSection = document.getElementById('reading-area');
                        if (readingSection) {
                            readingSection.classList.add('fade-in');
                        }
                    }, 500); // Matches the 0.5s transition duration in CSS
                }
            }, 1000);
        });

        libraryContainer.addEventListener('mouseleave', () => {
            // Clear interval and hide timer immediately on mouse leave
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            // Only hide timer if fade-out hasn't started
            const librarySection = document.querySelector('.library-entrance-area');
            if (!librarySection || !librarySection.classList.contains('fade-out')) {
                timerDisplay.style.opacity = '0';
                timerDisplay.style.visibility = 'hidden';
            }
        });
    }

    // === Notebook Interaction ===
    const readingImage = document.getElementById('reading-image');
    const textEditorOverlay = document.getElementById('text-editor-overlay');

    // Page management variables
    // const charLimitPerPage = 1000; // Removed character limit logic for simplicity
    let currentPageSet = 0; // 0 = pages 1-2, 1 = pages 3-4, etc.
    // Initialize with structure for title/content per page
    let allPagesContent = [
        { title: "", content: "" }, // Page 1
        { title: "", content: "" }  // Page 2
    ]; 
    let totalPageSets = Math.ceil(allPagesContent.length / 2); // Calculate initial sets

    if (readingImage && textEditorOverlay) {
        readingImage.addEventListener('click', () => {
            console.log('Notebook image clicked.');
            readingImage.classList.add('fade-out-quick');
            textEditorOverlay.classList.add('text-editor-overlay--visible');

            // Focus the first page's title div
            const firstPageTitleDiv = document.querySelector('#notebook-page-1 .notebook-page-title');
            if (firstPageTitleDiv) {
                firstPageTitleDiv.focus();
            }
        });

        // === Formatting Controls ===
        const formattingButtons = {
            bold: document.getElementById('format-bold'),
            italic: document.getElementById('format-italic'),
            underline: document.getElementById('format-underline'),
            strikethrough: document.getElementById('format-strikethrough'),
            h1: document.getElementById('format-heading'), // Assuming H1 for heading button
            quote: document.getElementById('format-quote'),
            code: document.getElementById('format-code'),
            insertUnorderedList: document.getElementById('format-list-ul'),
            insertOrderedList: document.getElementById('format-list-ol'),
            indent: document.getElementById('format-indent'),
            outdent: document.getElementById('format-outdent'),
            justifyLeft: document.getElementById('format-align-left'),
            justifyCenter: document.getElementById('format-align-center'),
            justifyRight: document.getElementById('format-align-right'),
            justifyFull: document.getElementById('format-align-justify'),
            removeFormat: document.getElementById('format-clear')
        };

        // Track format state to maintain selection
        let formatState = {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            h1: false,
            quote: false,
            code: false,
            insertUnorderedList: false,
            insertOrderedList: false,
            justifyLeft: false,
            justifyCenter: false,
            justifyRight: false,
            justifyFull: false
        };
        let lastFocusedEditable = null; // Keep track of the last focused editor element

        // Helper function to apply formatting using execCommand
        function applyFormatting(command, value = null) {
            // Ensure we have a selection within an editable area if possible
            if (lastFocusedEditable && document.activeElement !== lastFocusedEditable) {
                // If focus is lost, try to re-focus the last known editable area
                // This helps execCommand work more reliably
                lastFocusedEditable.focus();
                // Restore selection if possible (might be complex, attempt basic focus)
            }
            
            document.execCommand(command, false, value);

            // Update internal state immediately *after* command execution
             if (command === 'removeFormat') {
                for (let key in formatState) formatState[key] = false;
                formatState.justifyLeft = true; // Default to left align after clearing
                document.execCommand('justifyLeft', false, null); // Apply default alignment
            } else if (command.startsWith('justify')) {
                formatState.justifyLeft = (command === 'justifyLeft');
                formatState.justifyCenter = (command === 'justifyCenter');
                formatState.justifyRight = (command === 'justifyRight');
                formatState.justifyFull = (command === 'justifyFull');
            } else if (command === 'formatBlock') {
                 const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
                 // Correctly check the *intended* state after toggle
                 formatState.h1 = (value === 'h1' && currentBlock !== 'h1'); 
                 formatState.quote = (value === 'blockquote' && currentBlock !== 'blockquote');
                 formatState.code = (value === 'pre' && currentBlock !== 'pre');
                 // Reset other block formats if one is applied
                 if (formatState.h1) { formatState.quote = false; formatState.code = false; }
                 if (formatState.quote) { formatState.h1 = false; formatState.code = false; }
                 if (formatState.code) { formatState.h1 = false; formatState.quote = false; }
            } else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
                 // These often need explicit state check after execution
                 formatState.insertUnorderedList = document.queryCommandState('insertUnorderedList');
                 formatState.insertOrderedList = document.queryCommandState('insertOrderedList');
            } else if (command in formatState) {
                 // For toggle commands like bold, italic, etc.
                 // queryCommandState should reflect the new state after execCommand
                 try {
                    formatState[command] = document.queryCommandState(command);
                 } catch (e) {
                     console.error("Error querying command state after applying:", command, e);
                     // Fallback: toggle internal state (less reliable)
                     // formatState[command] = !formatState[command]; 
                 }
            }
             // Indent/Outdent don't have persistent states we track this way

            // Force update of toolbar visuals based on the new state
            updateToolbarStates(true); // Pass true to force update from state object

            // Update saved content after formatting
            saveCurrentPageContent();
        }

        // Function to update the visual state of toolbar buttons
        // Pass forceUpdate=true to update buttons based on internal formatState
        // otherwise, update based on current selection/focus
        function updateToolbarStates(forceUpdateFromState = false) {
            const activeElement = document.activeElement;
            const isEditableFocused = activeElement && (activeElement.classList.contains('notebook-page-title') || activeElement.classList.contains('notebook-page-content'));

            if (isEditableFocused) {
                lastFocusedEditable = activeElement; // Update last focused element
            }

            // If not focused on editable OR forced update, use cached state. Otherwise, query the live state.
            const shouldUseCachedState = forceUpdateFromState || !isEditableFocused;

            for (const [command, button] of Object.entries(formattingButtons)) {
                if (button) {
                    let isActive = false;
                    try {
                        if (shouldUseCachedState) {
                            // Use internal formatState
                            if (command in formatState) {
                                isActive = formatState[command];
                            }
                             // Handle alignment which isn't directly in formatState object keys
                             else if (command === 'justifyLeft' && formatState.justifyLeft) isActive = true;
                             else if (command === 'justifyCenter' && formatState.justifyCenter) isActive = true;
                             else if (command === 'justifyRight' && formatState.justifyRight) isActive = true;
                             else if (command === 'justifyFull' && formatState.justifyFull) isActive = true;
                             else if (command === 'h1' && formatState.h1) isActive = true;
                             else if (command === 'quote' && formatState.quote) isActive = true;
                             else if (command === 'code' && formatState.code) isActive = true;
                             // Lists might need special handling if state isn't perfectly tracked
                             else if (command === 'insertUnorderedList' && formatState.insertUnorderedList) isActive = true;
                             else if (command === 'insertOrderedList' && formatState.insertOrderedList) isActive = true;
                             // Actions like clear, indent, outdent are never 'active' visually
                             else { isActive = false; }

                        } else if (isEditableFocused) {
                            // Query live state from the document/selection
                            if (command.startsWith('justify')) {
                               const style = window.getComputedStyle(lastFocusedEditable); // Use last focused
                               const textAlign = style.textAlign;
                               // Note: 'start'/'end' depend on text direction, handle common cases
                               isActive = (command === 'justifyLeft' && (textAlign === 'left' || textAlign === 'start')) ||
                                          (command === 'justifyCenter' && textAlign === 'center') ||
                                          (command === 'justifyRight' && (textAlign === 'right' || textAlign === 'end')) ||
                                          (command === 'justifyFull' && textAlign === 'justify');
                               // Update internal state based on live query for alignment
                               formatState.justifyLeft = (textAlign === 'left' || textAlign === 'start');
                               formatState.justifyCenter = textAlign === 'center';
                               formatState.justifyRight = (textAlign === 'right' || textAlign === 'end');
                               formatState.justifyFull = textAlign === 'justify';
                            } else if (command === 'h1') {
                                isActive = document.queryCommandValue('formatBlock').toLowerCase() === 'h1';
                                formatState.h1 = isActive; // Update internal state
                            } else if (command === 'quote') {
                                isActive = document.queryCommandValue('formatBlock').toLowerCase() === 'blockquote';
                                formatState.quote = isActive; // Update internal state
                            } else if (command === 'code') {
                                isActive = document.queryCommandValue('formatBlock').toLowerCase() === 'pre';
                                formatState.code = isActive; // Update internal state
                            } else if (command === 'removeFormat' || command === 'indent' || command === 'outdent') {
                                isActive = false; // These are momentary actions
                            } else {
                                // Standard toggle commands
                                isActive = document.queryCommandState(command);
                                if (command in formatState) {
                                    formatState[command] = isActive; // Update internal state
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Error updating toolbar state for:", command, e);
                        // Use cached state as fallback on error
                        isActive = formatState[command] || false; 
                    }
                    button.classList.toggle('active', isActive);
                }
            }
        }

        // Attach event listeners to formatting buttons
        if (formattingButtons.bold) formattingButtons.bold.addEventListener('click', () => applyFormatting('bold'));
        if (formattingButtons.italic) formattingButtons.italic.addEventListener('click', () => applyFormatting('italic'));
        if (formattingButtons.underline) formattingButtons.underline.addEventListener('click', () => applyFormatting('underline'));
        if (formattingButtons.strikethrough) formattingButtons.strikethrough.addEventListener('click', () => applyFormatting('strikeThrough'));

        // Toggle H1 / default paragraph
        if (formattingButtons.h1) {
            formattingButtons.h1.addEventListener('click', () => {
                const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
                applyFormatting('formatBlock', currentBlock === 'h1' ? 'p' : 'h1');
            });
        }

        // Toggle quote formatting
        if (formattingButtons.quote) {
            formattingButtons.quote.addEventListener('click', () => {
                const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
                applyFormatting('formatBlock', currentBlock === 'blockquote' ? 'p' : 'blockquote');
            });
        }

        // Toggle code block
        if (formattingButtons.code) {
            formattingButtons.code.addEventListener('click', () => {
                const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
                applyFormatting('formatBlock', currentBlock === 'pre' ? 'p' : 'pre');
            });
        }

        if (formattingButtons.insertUnorderedList) formattingButtons.insertUnorderedList.addEventListener('click', () => applyFormatting('insertUnorderedList'));
        if (formattingButtons.insertOrderedList) formattingButtons.insertOrderedList.addEventListener('click', () => applyFormatting('insertOrderedList'));
        if (formattingButtons.indent) formattingButtons.indent.addEventListener('click', () => applyFormatting('indent'));
        if (formattingButtons.outdent) formattingButtons.outdent.addEventListener('click', () => applyFormatting('outdent'));
        if (formattingButtons.justifyLeft) formattingButtons.justifyLeft.addEventListener('click', () => applyFormatting('justifyLeft'));
        if (formattingButtons.justifyCenter) formattingButtons.justifyCenter.addEventListener('click', () => applyFormatting('justifyCenter'));
        if (formattingButtons.justifyRight) formattingButtons.justifyRight.addEventListener('click', () => applyFormatting('justifyRight'));
        if (formattingButtons.justifyFull) formattingButtons.justifyFull.addEventListener('click', () => applyFormatting('justifyFull'));
        if (formattingButtons.removeFormat) formattingButtons.removeFormat.addEventListener('click', () => applyFormatting('removeFormat'));

        // Update toolbar state on selection change or click/keyup within the editor
        document.addEventListener('selectionchange', updateToolbarStates);
        const pageContainer = document.getElementById('notebook-pages-container');
        if (pageContainer) {
            // Delegate events from the container to the editable divs
            pageContainer.addEventListener('click', (event) => {
                if (event.target.matches('.notebook-page-title, .notebook-page-content')) {
                    updateToolbarStates(); // Update based on click/selection
                }
            });
            pageContainer.addEventListener('keyup', (event) => {
                 if (event.target.matches('.notebook-page-title, .notebook-page-content')) {
                    updateToolbarStates(); // Update based on selection change after keyup
                    saveCurrentPageContent(); // Save on keyup as well
                }
            });
             pageContainer.addEventListener('focusin', (event) => {
                 if (event.target.matches('.notebook-page-title, .notebook-page-content')) {
                    lastFocusedEditable = event.target; // Track focused element
                    updateToolbarStates(); // Update toolbar on focus
                }
            });
            pageContainer.addEventListener('focusout', (event) => {
                 if (event.target.matches('.notebook-page-title, .notebook-page-content')) {
                    // Don't necessarily clear lastFocusedEditable here, 
                    // as focus might shift briefly to a button
                    // updateToolbarStates() will handle using the cached state if needed
                    // Optionally: Use a small timeout to see if focus returns to another editable
                 }
            });
        }

        // === Export functionality ===
        const exportButton = document.getElementById('export-button');
        const exportOptions = document.getElementById('export-options');
        
        if (exportButton && exportOptions) {
            // Remove inline positioning which might conflict with CSS
            exportOptions.style.position = '';
            exportOptions.style.top = '';
            exportOptions.style.right = '';
            exportOptions.style.zIndex = '';
            
            // Toggle export dropdown with proper positioning
            exportButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                
                // If already showing, just hide it
                if (exportOptions.classList.contains('show')) {
                    exportOptions.classList.remove('show');
                    return;
                }
                
                // Get position of the export button
                const buttonRect = exportButton.getBoundingClientRect();
                
                // Position the dropdown to the left of the button (for vertical toolbar)
                exportOptions.style.bottom = (window.innerHeight - buttonRect.bottom) + 'px';
                exportOptions.style.right = (window.innerWidth - buttonRect.left + 10) + 'px';
                
                // Show the dropdown
                exportOptions.classList.add('show');
            });
            
            // Close export dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!exportButton.contains(e.target) && !exportOptions.contains(e.target)) {
                    exportOptions.classList.remove('show');
                }
            });
            
            // Handle export options
            const exportOptionButtons = document.querySelectorAll('.export-option');
            exportOptionButtons.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    const format = option.getAttribute('data-format');
                    exportNotebook(format);
                    exportOptions.classList.remove('show');
                });
            });
        }
        
        // Helper function to get plain text from HTML, preserving structure better
        function getPlainTextFromHTML(html) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            // Replace block elements with newlines for better structure
            tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, li, br, hr').forEach(el => {
                el.after(document.createTextNode('\n'));
            });
            // Add space after list items markers if needed
            tempDiv.querySelectorAll('li').forEach(li => {
                if (li.textContent.trim().length > 0 && !li.textContent.startsWith(' ')) {
                   li.prepend(document.createTextNode(' ')); 
                }
            });
            // Crude list marker handling for text
            let text = tempDiv.textContent || "";
            text = text.replace(/^\s*\n/gm, '\n'); // Remove leading blank lines from blocks
            return text.trim();
        }

        // Improved HTML to Markdown conversion (basic)
        function htmlToMarkdown(html) {
            let md = html;
            // Block elements first (with newlines)
            md = md.replace(/<h1.*?>(.*?)<\/h1>/gi, '# $1\n\n');
            md = md.replace(/<h2.*?>(.*?)<\/h2>/gi, '## $1\n\n');
            md = md.replace(/<h3.*?>(.*?)<\/h3>/gi, '### $1\n\n');
            md = md.replace(/<h4.*?>(.*?)<\/h4>/gi, '#### $1\n\n');
            md = md.replace(/<h5.*?>(.*?)<\/h5>/gi, '##### $1\n\n');
            md = md.replace(/<h6.*?>(.*?)<\/h6>/gi, '###### $1\n\n');
            md = md.replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n');
            md = md.replace(/<ul.*?>(.*?)<\/ul>/gis, (match, p1) => p1.replace(/<li.*?>(.*?)<\/li>/gi, '- $1\n') + '\n');
            md = md.replace(/<ol.*?>(.*?)<\/ol>/gis, (match, p1) => {
                let count = 1;
                return p1.replace(/<li.*?>(.*?)<\/li>/gi, (m, item) => `${count++}. ${item}\n`) + '\n';
            });
            md = md.replace(/<div style="text-align: center;">(.*?)<\/div>/gi, '\n::: center\n$1\n:::\n'); // Custom syntax
            md = md.replace(/<div style="text-align: right;">(.*?)<\/div>/gi, '\n::: right\n$1\n:::\n'); // Custom syntax
            md = md.replace(/<div.*?>(.*?)<\/div>/gi, '$1\n'); // Generic div to newline
            md = md.replace(/<hr.*?>/gi, '\n---\n\n');
            md = md.replace(/<br.*?>/gi, '  \n'); // Markdown line break

            // Inline elements
            md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
            md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
            md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
            md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
            md = md.replace(/<u>(.*?)<\/u>/gi, '$1'); // Underline not standard MD, strip or use custom

            // Clean up remaining tags and extra whitespace
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = md; // Use browser to help decode entities
            md = tempDiv.textContent || "";
            // md = md.replace(/<[^>]*>/g, ''); // Strip remaining tags
            md = md.replace(/^\s*\n{3,}/g, '\n\n'); // Collapse excessive newlines
            md = md.trim();
            return md;
        }

        // Export function (Updated for new content structure)
        async function exportNotebook(format) {
            saveCurrentPageContent(); // Ensure latest content is saved

            // Combine title and content for export
            const contentToExport = allPagesContent.map((pageData, index) => {
                const titleText = getPlainTextFromHTML(pageData.title).trim();
                const contentText = getPlainTextFromHTML(pageData.content).trim();
                // Skip entirely empty pages (both title and content empty)
                if (!titleText && !contentText) return null;
                // Return combined HTML for non-empty pages
                return `${pageData.title}<hr>${pageData.content}`; // Combine with HR for structure
            }).filter(content => content !== null); // Filter out null entries (empty pages)

            if (contentToExport.length === 0) {
                alert('Nothing to export. Please add some content first.');
                return;
            }

            switch(format) {
                case 'txt':
                    // Generate TXT: Add titles and content with separators
                    const plainText = allPagesContent.map((pageData, index) => {
                         const titleText = getPlainTextFromHTML(pageData.title).trim();
                         const contentText = getPlainTextFromHTML(pageData.content).trim();
                         if (!titleText && !contentText) return null;
                         let pageStr = ``;
                         if (titleText) pageStr += `Title: ${titleText}\n`;
                         pageStr += `---\n${contentText}`;
                         return pageStr;
                    }).filter(p => p !== null).join('\n\n=== Page ${index + 1} ===\n\n');
                    downloadFile('notebook_export.txt', plainText, 'text/plain');
                    break;
                case 'md':
                     // Generate MD: Convert title/content HTML to Markdown
                     const markdown = allPagesContent.map((pageData, index) => {
                         const titleMd = htmlToMarkdown(pageData.title).trim();
                         const contentMd = htmlToMarkdown(pageData.content).trim();
                         if (!titleMd && !contentMd) return null;
                         let pageStr = ``;
                         if (titleMd) pageStr += `# ${titleMd}\n\n`; // Use H1 for title
                         pageStr += `${contentMd}`;
                         return pageStr;
                     }).filter(p => p !== null).join('\n\n---\n\n'); // Use HR for page break
                    downloadFile('notebook_export.md', markdown, 'text/markdown');
                    break;
                case 'pdf':
                     try {
                        // Combine HTML for PDF print
                        const combinedHtmlForPdf = allPagesContent.map(pageData => {
                             const titleHtml = pageData.title.trim();
                             const contentHtml = pageData.content.trim();
                             if (!titleHtml && !contentHtml) return null;
                             // Use a structure suitable for print
                             return `<div class="page-print">${titleHtml ? `<h1>${getPlainTextFromHTML(titleHtml)}</h1><hr>` : ''}${contentHtml}</div>`;
                        }).filter(p => p !== null).join('<div style="page-break-after: always;"></div>');
                        
                        if (!combinedHtmlForPdf) {
                             alert('Nothing to export.'); return;
                        }
                        exportToPdfViaPrint(combinedHtmlForPdf); // Pass the combined HTML string
                    } catch (error) {
                        console.error("PDF Export Error:", error);
                        alert('Failed to initiate PDF export via print dialog.');
                    }                   
                    break;
                case 'img':
                    if (typeof html2canvas === 'undefined') {
                        alert('Image export library (html2canvas) not loaded.');
                        return;
                    }
                    try {
                        // Pass the original page data structure to the image exporter
                        await exportToImages(allPagesContent); 
                    } catch (error) {
                        console.error("Image Export Error:", error);
                        alert('Failed to export pages as images.');
                    }
                    break;
            }
        }

        // Function to export content using the print dialog (Accepts combined HTML string)
        function exportToPdfViaPrint(combinedHtml) {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Notebook Export</title>
                    <style>
                        body { font-family: 'Tiempos Text', serif; font-size: 11pt; line-height: 1.4; margin: 30px; }
                        .page-print { min-height: 90vh; } /* Ensure content fills page */
                        h1 { font-size: 18pt; font-weight: bold; margin-top: 0; margin-bottom: 0.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; }
                        hr { border: none; border-top: 1px solid #eee; margin: 1em 0; }
                        /* ... other essential styles ... */
                        @media print {
                            div[style*="page-break-after"] { page-break-after: always; }
                            .page-print { page-break-inside: avoid; } 
                        }
                    </style>
                </head>
                <body>${combinedHtml}</body>
                </html>
            `);
            doc.close();

            // Use setTimeout to ensure content is loaded before printing
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus(); // Focus is needed for print to work in some browsers
                    iframe.contentWindow.print();
                } catch (e) {
                    console.error('Print dialog failed:', e);
                    alert('Could not open print dialog. Please check browser settings or pop-up blockers.');
                } finally {
                    // Clean up the iframe after a delay
                    setTimeout(() => document.body.removeChild(iframe), 1000);
                }
            }, 500); // Adjust delay if needed
        }

        // Function to export pages as individual images (updated for title/content)
        async function exportToImages(pagesDataArray) {
            const pageContainer = document.getElementById('notebook-pages-container');
            const pageStyle = window.getComputedStyle(pageContainer.querySelector('.notebook-page'));
            const titleStyle = window.getComputedStyle(pageContainer.querySelector('.notebook-page-title'));
            const contentStyle = window.getComputedStyle(pageContainer.querySelector('.notebook-page-content'));
            const hrStyle = window.getComputedStyle(pageContainer.querySelector('hr.page-divider'));
            
            const tempRenderDiv = document.createElement('div');
            // Apply container styles roughly
            tempRenderDiv.style.width = pageStyle.width;
            tempRenderDiv.style.height = pageStyle.height;
            tempRenderDiv.style.display = 'flex';
            tempRenderDiv.style.flexDirection = 'column';
            tempRenderDiv.style.fontFamily = pageStyle.fontFamily;
            tempRenderDiv.style.backgroundColor = 'white'; // Solid background for capture
            tempRenderDiv.style.border = '1px solid #ccc';
            tempRenderDiv.style.position = 'absolute';
            tempRenderDiv.style.left = '-9999px';
            tempRenderDiv.style.top = '-9999px';
            document.body.appendChild(tempRenderDiv);

            const nonEmtpyPages = pagesDataArray.filter(p => p.title.trim() || p.content.trim());
            if(nonEmtpyPages.length === 0) { alert("Nothing to export."); return; }
            alert(`Starting image export for ${nonEmtpyPages.length} pages...`);

            for (let i = 0; i < pagesDataArray.length; i++) {
                const pageData = pagesDataArray[i];
                if (!pageData.title.trim() && !pageData.content.trim()) continue; // Skip empty

                // Construct inner HTML for rendering
                tempRenderDiv.innerHTML = `
                    <div style="padding: ${titleStyle.padding}; font-size: ${titleStyle.fontSize}; line-height: ${titleStyle.lineHeight}; flex-shrink: 0; min-height: ${titleStyle.minHeight}; overflow-y: auto;">${pageData.title}</div>
                    <hr style="border: none; border-top: ${hrStyle.borderTopWidth} ${hrStyle.borderTopStyle} ${hrStyle.borderTopColor}; margin: ${hrStyle.margin}; flex-shrink: 0;">
                    <div style="padding: ${contentStyle.padding}; font-size: ${contentStyle.fontSize}; line-height: ${contentStyle.lineHeight}; flex-grow: 1; overflow-y: auto;">${pageData.content}</div>
                `;

                try {
                    const canvas = await html2canvas(tempRenderDiv, { scale: 2, useCORS: true, logging: false });
                    const imageDataUrl = canvas.toDataURL('image/png');
                    downloadFile(`notebook_page_${i + 1}.png`, imageDataUrl, 'image/png', true);
                } catch (err) {
                    console.error(`Failed to render page ${i + 1} to image:`, err);
                    alert(`Failed to render page ${i + 1}.`);
                }
            }

            document.body.removeChild(tempRenderDiv);
            alert('Image export process finished.');
        }

        // Helper function to download file (updated for image data URLs)
        function downloadFile(filename, content, contentType, isDataUrl = false) {
            const a = document.createElement('a');
            let url;

            if (isDataUrl) {
                url = content;
            } else {
                const blob = new Blob([content], { type: contentType });
                url = URL.createObjectURL(blob);
            }

            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // Required for Firefox
            a.click();
            document.body.removeChild(a);

            if (!isDataUrl) {
                URL.revokeObjectURL(url);
            }
        }

        // === Page Flow Logic (Updated) ===
        const page1Div = document.getElementById('notebook-page-1'); // Container div
        const page2Div = document.getElementById('notebook-page-2'); // Container div
        const currentPageIndicator = document.getElementById('current-page');
        const totalPagesIndicator = document.getElementById('total-pages');
        const prevPageButton = document.getElementById('prev-page');
        const nextPageButton = document.getElementById('next-page');
        
        // Function to save current page set's title and content (innerHTML)
        function saveCurrentPageContent() {
             const page1Index = currentPageSet * 2;
             const page2Index = page1Index + 1;
             if (page1Div) {
                 const title1 = page1Div.querySelector('.notebook-page-title');
                 const content1 = page1Div.querySelector('.notebook-page-content');
                 if (title1 && content1 && allPagesContent[page1Index] !== undefined) {
                    allPagesContent[page1Index].title = title1.innerHTML;
                    allPagesContent[page1Index].content = content1.innerHTML;
                 }
             }
            if (page2Div) {
                 const title2 = page2Div.querySelector('.notebook-page-title');
                 const content2 = page2Div.querySelector('.notebook-page-content');
                 if (title2 && content2 && allPagesContent[page2Index] !== undefined) {
                    allPagesContent[page2Index].title = title2.innerHTML;
                    allPagesContent[page2Index].content = content2.innerHTML;
                 }             
            }
            // console.log('Saved content:', allPagesContent);
        }
        
        // Initialize page indicators
        function updatePageIndicators() {
             if (currentPageIndicator) {
                 currentPageIndicator.textContent = `${currentPageSet * 2 + 1}-${currentPageSet * 2 + 2}`;
             }
             if (totalPagesIndicator) {
                 totalPagesIndicator.textContent = allPagesContent.length;
             }
        }
        updatePageIndicators(); // Initial update
        
        // Update navigation buttons state
        function updateNavButtons() {
            if (prevPageButton) prevPageButton.disabled = currentPageSet === 0;
            // Enable next button if there are more pages OR if the current last pages have content
            if (nextPageButton) {
                 const lastPageIndex = allPagesContent.length - 1;
                 const secondLastPageIndex = lastPageIndex - 1;
                 const isLastSet = currentPageSet === totalPageSets - 1;
                 const lastPageHasContent = allPagesContent[lastPageIndex]?.title.trim() || allPagesContent[lastPageIndex]?.content.trim();
                 const secondLastPageHasContent = allPagesContent[secondLastPageIndex]?.title.trim() || allPagesContent[secondLastPageIndex]?.content.trim();
                 
                 // Allow creating new pages if on the last set AND there's content on either of the last two pages
                 nextPageButton.disabled = !(isLastSet && (lastPageHasContent || secondLastPageHasContent)) && currentPageSet >= totalPageSets - 1;
            }
        }
        
        // Load content for current page set (using innerHTML for title/content)
        function loadCurrentPageSet() {
            const page1Index = currentPageSet * 2;
            const page2Index = page1Index + 1;
            
            // Ensure page data objects exist
            if (allPagesContent[page1Index] === undefined) allPagesContent[page1Index] = { title: '', content: '' };
            if (allPagesContent[page2Index] === undefined) allPagesContent[page2Index] = { title: '', content: '' };
            
            // Set innerHTML content for title and content divs
            if (page1Div) {
                const title1 = page1Div.querySelector('.notebook-page-title');
                const content1 = page1Div.querySelector('.notebook-page-content');
                if(title1) title1.innerHTML = allPagesContent[page1Index].title;
                if(content1) content1.innerHTML = allPagesContent[page1Index].content;
            }
            if (page2Div) {
                const title2 = page2Div.querySelector('.notebook-page-title');
                const content2 = page2Div.querySelector('.notebook-page-content');
                if(title2) title2.innerHTML = allPagesContent[page2Index].title;
                if(content2) content2.innerHTML = allPagesContent[page2Index].content;
            }
            
            updatePageIndicators();
            updateNavButtons();
        }
        
        // Apply input handling to title/content divs - Simplified: just save on input
        function handlePageInput(containerDiv, pageIndex) {
             const titleDiv = containerDiv.querySelector('.notebook-page-title');
             const contentDiv = containerDiv.querySelector('.notebook-page-content');

             const inputSaver = () => {
                 if(allPagesContent[pageIndex]) { // Ensure page data exists
                     if (titleDiv) allPagesContent[pageIndex].title = titleDiv.innerHTML;
                     if (contentDiv) allPagesContent[pageIndex].content = contentDiv.innerHTML;
                 }
                 updateNavButtons(); // Check if next should be enabled
             };

             if (titleDiv) titleDiv.addEventListener('input', inputSaver);
             if (contentDiv) contentDiv.addEventListener('input', inputSaver);
        }
        
        // Apply input handling to initial page divs
        if (page1Div) handlePageInput(page1Div, 0);
        if (page2Div) handlePageInput(page2Div, 1);
        
        // Load GSAP if needed
        function loadGSAP() {
            if (typeof gsap !== 'undefined') {
                return Promise.resolve();
            }
            
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load GSAP'));
                document.head.appendChild(script);
            });
        }
        
        // Try to load GSAP
        loadGSAP().catch(error => console.warn('GSAP not loaded, using CSS animations:', error));
        
        // Page navigation functions (updated to save/load new structure)
        function navigateToPrevSet() {
            if (currentPageSet > 0) {
                saveCurrentPageContent(); 
                currentPageSet--;
                animatePageTurn(true); // true for previous
            }
        }
        
        function navigateToNextSet() {
            saveCurrentPageContent(); 
            
            // Check if we need to create a new page set
            const nextPageSetIndex = currentPageSet + 1;
            if (nextPageSetIndex >= totalPageSets) {
                 totalPageSets++;
                 // Add two new page data objects
                 allPagesContent.push({ title: '', content: '' }); 
                 allPagesContent.push({ title: '', content: '' }); 
            }
            
            currentPageSet++;
            // Re-apply input handlers to the potentially new content of page divs after load
            animatePageTurn(false, () => {
                 if(page1Div) handlePageInput(page1Div, currentPageSet * 2);
                 if(page2Div) handlePageInput(page2Div, currentPageSet * 2 + 1);
            }); 
        }
        
        // Consolidated animation function (Updated callback)
        function animatePageTurn(isPrevious, onCompleteCallback = null) {
             const pageContainers = [page1Div, page2Div].filter(el => el);
             if (pageContainers.length > 0) {
                 const rotation = isPrevious ? 90 : -90;
                 const startRotation = isPrevious ? -90 : 90;
                
                 const onCompleteAnimation = () => {
                     loadCurrentPageSet();
                     if (typeof gsap !== 'undefined') {
                         gsap.fromTo(pageContainers, 
                             { rotationY: startRotation, opacity: 0.5 },
                             { 
                                 duration: 0.4, 
                                 rotationY: 0, 
                                 opacity: 1,
                                 ease: "power2.out",
                                 onComplete: onCompleteCallback // Execute callback after animation finishes
                             }
                         );
                     } else {
                         // Handle CSS animation completion
                          pageContainers.forEach(p => p.classList.remove('flip-animation')); 
                          if(onCompleteCallback) onCompleteCallback();
                     }
                 };

                 if (typeof gsap !== 'undefined') {
                    gsap.to(pageContainers, {
                        duration: 0.4,
                        rotationY: rotation,
                        opacity: 0.5,
                        ease: "power2.in",
                        onComplete: onCompleteAnimation
                    });
                } else {
                    // Fallback to CSS animations
                    pageContainers.forEach(p => p.classList.add('flip-animation'));
                    setTimeout(() => {
                       loadCurrentPageSet(); // Load content mid-way
                       setTimeout(() => { // Remove class after animation should finish
                            pageContainers.forEach(p => p.classList.remove('flip-animation'));
                            if(onCompleteCallback) onCompleteCallback(); // Callback for CSS version
                       }, 350); 
                    }, 350); // Half of the animation duration
                }
            } else {
                loadCurrentPageSet(); // Load directly if divs aren't found
                 if(onCompleteCallback) onCompleteCallback();
            }
        }
        
        // Attach event listeners to navigation buttons (no change)
        if (prevPageButton) prevPageButton.addEventListener('click', navigateToPrevSet);
        if (nextPageButton) nextPageButton.addEventListener('click', navigateToNextSet);
        
        // Add keyboard shortcuts (no change needed in logic, applies to focused element)
        document.addEventListener('keydown', (e) => {
            // Check if focus is within the notebook
            const isNotebookFocused = textEditorOverlay.classList.contains('text-editor-overlay--visible');
            if (!isNotebookFocused) return;
            
            // Arrow keys with Alt for navigation
            if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                navigateToNextSet();
            } else if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateToPrevSet();
            }
            
            // Keyboard shortcuts for formatting
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        applyFormatting('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        applyFormatting('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        applyFormatting('underline');
                        break;
                }
            }
        });
        
        // Initialize page set
        loadCurrentPageSet();
    }
}); 