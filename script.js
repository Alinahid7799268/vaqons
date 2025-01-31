document.getElementById("calculation-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const tip = document.getElementById("tip").value.trim();
    const weight = parseFloat(document.getElementById("weight").value);
    const density = parseFloat(document.getElementById("density").value);

    if (!tip || isNaN(weight) || isNaN(density)) {
        alert("Lütfen tüm alanları doğru şekilde doldurun.");
        return;
    }

    const targetVolume = weight / density;

    // Basit bir interpolasyon simülasyonu (örnek amaçlı)
    const resultCm = targetVolume * 0.225; // Gerçek verilere göre değiştirilmeli

    document.getElementById("volume").textContent = targetVolume.toFixed(2);
    document.getElementById("result-cm").textContent = resultCm.toFixed(2);
    document.getElementById("result").classList.remove("hidden");
});
