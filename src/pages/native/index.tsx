import React, {ChangeEventHandler, FunctionComponent, useEffect} from 'react';
import {Link} from "react-router-dom";
import {filesize} from "filesize";

interface OwnProps {
}

type Props = OwnProps;

const NativePage: FunctionComponent<Props> = (props) => {
    // Polyfill for older browsers
    useEffect(() => {
        if (!HTMLCanvasElement.prototype.toBlob) {
            Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function (callback: (blob: Blob | null) => void, type: string, quality: number) {

                    const binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                        len = binStr.length,
                        arr = new Uint8Array(len);

                    for (let i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    callback(new Blob([arr], {type: type || 'image/png'}));
                }
            });
        } else {
            console.log(`Custom Polyfill NOT set. Browser supports the Canvas.toBlob API`)
        }
    }, []);

    const handleImageFileCompression: ChangeEventHandler<HTMLInputElement> = (e) => {
        const imageFiles: FileList | null = e.target.files
        if (imageFiles) {
            const imageFile: File = imageFiles[0]
            const blobURL = window.URL.createObjectURL(imageFile)

            const image = new Image()
            image.src = blobURL

            image.onload = async (a) => {
                // release memory
                window.URL.revokeObjectURL(blobURL)

                const newWidth: number = 360
                const newHeight: number = 240

                const canvas = document.createElement('canvas')
                canvas.width = newWidth
                canvas.height = newHeight

                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(image, 0, 0, newWidth, newHeight);

                    // OPTION 1: LATEST BROWSERS
                    canvas.toBlob((blob) => {
                        // Handle the compressed image...
                        console.log(blob)
                        /*console.log(`${imageFile.size} => ${blob?.size}`)*/

                        const p = document.createElement('p')
                        p.innerText = `Compressed original image(${imageFile.type}) from ${
                            filesize(imageFile.size)
                        } to ${
                            filesize(blob?.size)
                        }`

                        document.body.append(p)
                    }, imageFile.type, 1)

                    document.body.append(canvas)

                    /*
                    // SAVE TO FILE
                    // create a new handle
                    const newHandle = await window.showSaveFilePicker();

                    // create a FileSystemWritableFileStream to write to
                    const writableStream = await newHandle.createWritable();

                    // write our file
                    await writableStream.write(blob);

                    // close the file and write the contents to disk.
                    await writableStream.close();
                    */
                }
            }
        }
    }

    return (
        <div>
            <ul>
                <li>
                    <Link to={".."}>Back</Link>
                </li>
            </ul>
            <h1>Compression using Vanilla/Native API</h1>
            <div>
                <label htmlFor={"image_file"}>
                    Upload Image{" "}
                    <input type={"file"}
                           name={"image_file"}
                           id={"image_file"}
                           accept={"image/*"}
                           onChange={handleImageFileCompression}
                    />
                </label>
            </div>
            <br/>
        </div>
    );
};

export default NativePage;
