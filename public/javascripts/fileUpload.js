FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)


// FilePond.parse(document.body)
FilePond.create(
    document.querySelector('input[type="file"]')
    // document.getElementById('uploadCover')
);

FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
});
