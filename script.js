document.getElementById("calculation-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    fetch("/", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("volume").textContent = data.volume;
            document.getElementById("result-cm").textContent = data.result;
            document.getElementById("result").classList.remove("hidden");
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Hata:", error));
});
