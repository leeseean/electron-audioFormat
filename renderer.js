// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var ffmpeg = require('fluent-ffmpeg')
var ffmpegBinaries = require("ffmpeg-binaries")
ffmpeg.setFfmpegPath(ffmpegBinaries)
var path = require('path')
const { ipcRenderer } = require('electron')
var inFile = document.querySelector('#inFile');
var fileInput = document.querySelector('#file-input');
var transferInput = document.querySelector('#transfer-input');
var transferButton = document.querySelector('#transfer-button');
var transferPercent = document.querySelector('#transfer-percent');
inFile.addEventListener('change', e => {
    fileInput.value = e.target.files[0].path;
});
transferButton.addEventListener('click', e => {
    if (!fileInput.value) return;
    var command = ffmpeg(fileInput.value)
    var _dirname = path.dirname(fileInput.value);
    var name = path.basename(fileInput.value, path.extname(fileInput.value));
    command
        .on('progress', e => {
            transferPercent.innerHTML = `${Math.ceil(e.percent)}%`;
        })
        .on('end', e => transferPercent.innerHTML = '转码完成！')
        .on('error', e => transferPercent.innerHTML = JSON.stringify(e))
        .save(`${_dirname}/${transferInput.value ? transferInput.value : name + '.mp3'}`)
});
document.addEventListener('dragenter', event => {
    event.preventDefault();
    event.stopPropagation();
});
document.addEventListener('dragover', event => {
    event.preventDefault();
    event.stopPropagation();
});
document.addEventListener('drop', event => {
    event.preventDefault();
    event.stopPropagation();
    [...event.dataTransfer.files].forEach(file => fileInput.value = file.path);
});


