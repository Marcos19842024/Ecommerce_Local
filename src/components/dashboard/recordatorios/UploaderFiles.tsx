import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../../shared/Loader";

export const UploaderFiles = () => {
    const [loading, setLoading] = useState(false);
    const [archivos, setArchivos] = useState([]);

    const handleUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const formData = new FormData()
        setLoading(true);
        for(let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        fetch(`/upload`, {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(res => {
            if(!res.err) {
                setArchivos(res.statusText);
                for(let i = 0; i < res.statusText.length; i++) {
                    let filename = res.statusText[i];
                    let filetype = filename.split(".").pop();
                    if(document.getElementById(filename) === null) {
                        getFileShow(filename, getFileTypes(filetype));
                    }
                }
                toast.success("Archivos subidos correctamente", {
                    position: 'bottom-right'
                });
                setLoading(false);
            }
        }).catch(() => {
            toast.error("Error al subir los archivos", {
                position: 'bottom-right'
            });
        });
        
    }

    function getFileTypes(filetype: string): [string, string] {
        switch(filetype) {
            case 'xlsx':
            case 'xls':
            case 'xlsm':
                return ['fa fa-file-excel-o','color:green'];
            case 'zip':
            case 'rar':
            case '7zip':
                return ['fa fa-file-archive-o','color:orange'];
            case 'doc':
            case 'docx':
                return ['fa fa-file-word-o','color:blue'];
            case 'pptx':
                return ['fa fa-file-powerpoint-o','color:red'];
            case 'mp3':
            case 'wav':
            case 'm4a':
                return ['fa fa-file-sound-o','color:blue'];
            case 'mp4':
            case 'mov':
            case 'avi':
            case 'wmv':
            case 'flv':
            case '3gp':
                return ['fa fa-file-video-o','color:blue'];
            case 'png':
            case 'jpg':
            case 'ico':
            case 'gif':
            case 'jpeg':
            case 'svg':
                return ['fa fa-file-picture-o','color:black'];
            case 'pdf':
                return ['fa fa-file-pdf-o','color:red'];
            case 'css':
            case 'html':
            case 'cs':
                return ['fa fa-file-code-o','color:black'];
            case 'txt':
                return ['fa fa-file-text-o','color:blue'];
            default:
                return ['fa fa-file','color:black'];
        }
    }

    function getFileShow(filename: string, filetype: string[]) {
        const filewrapper = document.getElementById("filewrapper");
        const showfileboxElem = document.createElement("div");
        showfileboxElem.classList.add("showfilebox");
        showfileboxElem.id = filename;
        const leftElem = document.createElement("div");
        leftElem.classList.add("left");
        const filetypeElem = document.createElement("a");
        filetypeElem.href = `/media/${filename}`;
        filetypeElem.target = "_blank";
        filetypeElem.rel = "noopener noreferrer";
        filetypeElem.className = filetype[0];
        filetypeElem.style = filetype[1];
        leftElem.append(filetypeElem);
        const filetitleElem = document.createElement("h5");
        filetitleElem.innerHTML = filename;
        leftElem.append(filetitleElem);
        showfileboxElem.append(leftElem);
        const rightElem = document.createElement("div");
        rightElem.classList.add("right");
        showfileboxElem.append(rightElem);
        const crossElem = document.createElement("span");
        crossElem.innerHTML = "&#215;";
        crossElem.addEventListener("click",async () => {
        fetch(`/delete/${filename}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(res => {
            if(res.err) {
                toast.error(`Error al eliminar el archivo: ${res.err}`, {
                    position: 'bottom-right'
                });
            } else {
                setArchivos(res.statusText);
                if (filewrapper) {
                    filewrapper.removeChild(showfileboxElem);
                }
            }
        }).catch(() => {
            toast.error(`Error al eliminar el archivo`, {
                position: 'bottom-right'
            });
        });
        rightElem.append(crossElem);
        if (filewrapper) {
            filewrapper.append(showfileboxElem);
        }
    });
}

    return (
        <div>
            <div className="wrapper">
                <div className="box">
                    <div className="uploadbox">
                        <input
                            type="file"
                            id="upload"
                            onChange={(e) => {
                                handleUpload(e.target.files);
                            }}
                            hidden
                            multiple>
                        </input>
                        <label
                            htmlFor="upload"
                            className="flex flex-row items-center justify-start cursor-pointer">
                            <span className="mr-2"><i className="fa fa-cloud-upload fa"></i></span>
                            <p className="text-sm">Click To Upload Files</p>
                        </label>
                    </div>
                    <div id="filewrapper"></div>
                </div>
            </div>
            <div className="loader">
                {loading && <Loader />}
            </div>
        </div>
    );
};