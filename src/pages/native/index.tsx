import React, {ChangeEventHandler, FunctionComponent, useEffect} from 'react';
import {Link} from "react-router-dom";
import {filesize} from "filesize";

interface OwnProps {
}

type Props = OwnProps;

const NativePage: FunctionComponent<Props> = (props) => {
    // Polyfill
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
        }
    }, []);

    const handleImageFileCompression: ChangeEventHandler<HTMLInputElement> = (e) => {
        const imageFiles: FileList | null = e.target.files
        if (imageFiles) {
            const imageFile: File = imageFiles[0]
            const blobURL = window.URL.createObjectURL(imageFile)

            const image = new Image()
            image.src = blobURL

            image.onload = (a) => {
                // release memory
                window.URL.revokeObjectURL(blobURL)

                const newWidth: number = 720
                const newHeight: number = 480

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

                    /* OPTION 2: OLDER BROWSERS
                    // TEST Polyfill
                    const binStr = atob(canvas.toDataURL(imageFile.type, 1).split(',')[1]),
                        len = binStr.length,
                        arr = new Uint8Array(len);

                    for (let i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    const blob :Blob = new Blob([arr], {type: imageFile.type || 'image/png'})

                    // Handle the compressed image...
                    console.log(blob)
                    /!*console.log(`${imageFile.size} => ${blob?.size}`)*!/

                    const p = document.createElement('p')
                    p.innerText = `Compressed original image(${imageFile.type}) from ${
                        filesize(imageFile.size)
                    } to ${
                        filesize(blob?.size)
                    }`

                    document.body.append(p)
                    */

                    document.body.append(canvas)
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
