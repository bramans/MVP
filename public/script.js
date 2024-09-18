let dropArea = document.getElementById('drop-area');
let fileElem = document.getElementById('fileElem');
let gallery = document.getElementById('gallery');
let compressBtn = document.getElementById('compressBtn');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

fileElem.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
    let img = document.createElement('img');
    img.file = file;
    gallery.appendChild(img);

    let reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

compressBtn.addEventListener('click', async () => {
    const files = fileElem.files;
    if (files.length === 0) {
        alert('No files selected for compression!');
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        console.log('Appending file:', file);
        formData.append('files', file);
    }

    try {
        const response = await fetch('http://localhost:3000/upload', {  // Ensure it points to your backend URL
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Server response:', result);
            alert(result.message);
        } else {
            console.error('Upload error:', result.message);
            alert(result.message);
        }
    } catch (error) {
        console.error('Error during file upload:', error);
        alert('An error occurred while uploading the files.');
    }
});
