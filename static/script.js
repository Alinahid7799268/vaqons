// Form gönderildiğinde çalışacak olan event listener
document.getElementById("calculation-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Formun varsayılan davranışını engelle

    // Form verilerini al
    const formData = new FormData(this);

    // API'ye POST isteği gönder
    fetch("/", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("API yanıt vermedi veya bir hata oluştu.");
        }
        return response.json(); // Yanıtı JSON olarak işle
    })
    .then(data => {
        if (data.status === "success") {
            // Sonuçları HTML elementlerine yazdır
            document.getElementById("volume").textContent = data.volume;
            document.getElementById("result-cm").textContent = data.result;

            // Sonuçları göstermek için "hidden" sınıfını kaldır
            const resultElement = document.getElementById("result");
            if (resultElement) {
                resultElement.classList.remove("hidden");
            } else {
                console.error("Hata: 'result' elementi bulunamadı.");
            }
        } else {
            // Hata mesajını kullanıcıya göster
            alert(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    })
    .catch(error => {
        console.error("Hata:", error.message || error);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    });
});
