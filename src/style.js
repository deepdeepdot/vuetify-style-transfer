
export function loadImageFromFile(image, fileSelect) {
    fileSelect.onchange = (evt) => {
        const f = evt.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = ((e) => {
            image.src = e.target.result;
        });
        fileReader.readAsDataURL(f);
        fileSelect.value = '';
    }
    fileSelect.click();
}