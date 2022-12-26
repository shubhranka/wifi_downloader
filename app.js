const express = require('express');
const app = express();
const fs = require('fs');

// Current directory
const path = require('path');

// Use pug
app.set('view engine', 'pug');

app.get('/:path', (req, res) => {
    
    // Get the path from the url
    // console.log(req.params.path)
    // console.log(req.params.path.split('|'))
    // If the path contains < at the end, then back to the previous directory
    // const requestedPath = req.params.path.endsWith('<') ? req.params.path.slice(0, -1) : req.params.path;
    const requestedPath = path.join(...req.params.path.split('|'));
    // console.log(requestedPath)

    if (requestedPath.endsWith('<')) {
        return
    }
    
    // Check if file
    if (fs
        .lstatSync(path.join(__dirname, requestedPath))
        .isFile()) {
            return res.download(path.join(__dirname, requestedPath));
        }
    // Check if file without lstating
    // console.log(fs.path.join(__dirname, requestedPath))
    // if (fs.existsSync(path.join(__dirname, requestedPath))) {
    //     return res.download(path.join(__dirname, requestedPath));
    // }
        
    // Get names of files in the directory
    const files = fs.readdirSync(path.join(__dirname, requestedPath));
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(__dirname, requestedPath, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    }
    );
    return res.render("files_folders",{files:files_with_type,base:requestedPath.replace(/\\/g, "|")});

});
app.get('/', (req, res) => {
    
    // Get the path from the url
    // const requestedPad = req.params.path;

    // Get names of files in the directory
    const files = fs.readdirSync(path.join(__dirname));
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(__dirname, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    });
    // Check file type file or folder
    res.render("files_folders",{files:files_with_type,base:""});
    // res.download(path.join(__dirname, 'test.txt'));
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});