document.getElementById("calculation-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Formun varsayılan davranışını engelle

    const formData = new FormData(this);

    fetch("/", {
        method: "POST",
        body: formData
    })
    .then(response => response.json()) // Yanıtı JSON olarak işle
    .then(data => {
        if (data.status === "success") {
            // Sonuçları HTML elementlerine yazdır
            document.getElementById("volume").textContent = data.volume;
            document.getElementById("result-cm").textContent = data.result;

            // Sonuçları göstermek için "hidden" sınıfını kaldır
            document.getElementById("result").classList.remove("hidden");
        } else {
            alert(data.message); // Hata mesajını kullanıcıya göster
        }
    })
    .catch(error => console.error("Hata:", error)); // Hataları konsola yazdır
});
