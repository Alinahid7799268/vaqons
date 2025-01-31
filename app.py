from flask import Flask, render_template, request, jsonify
import pandas as pd
from scipy.interpolate import interp1d

app = Flask(__name__)

# Excel dosyasını yükleme fonksiyonu
def load_data(file_path):
    xls = pd.ExcelFile(file_path)
    data = {}
    
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        
        # Sütun isimlerindeki boşlukları temizle
        df.columns = df.columns.str.strip()
        
        # Eğer sayfa boşsa atla
        if df.empty:
            continue
        
        # 'См' ve 'дм.куб' sütunlarını bul
        cm_columns = [col for col in df.columns if 'См' in col]
        volume_columns = [col for col in df.columns if 'дм.куб' in col]
        
        if not cm_columns or not volume_columns:
            continue
        
        sheet_data = []
        for cm_col, vol_col in zip(cm_columns, volume_columns):
            sub_df = df[[cm_col, vol_col]].dropna()
            if sub_df.empty:
                continue
            sub_df.columns = ['См', 'дм.куб']  # Sütun isimlerini standartlaştır
            sheet_data.append(sub_df)
        
        if not sheet_data:
            continue
        
        combined_data = pd.concat(sheet_data, ignore_index=True)
        combined_data.sort_values(by='дм.куб', inplace=True)  # Hacim değerine göre sırala
        data[sheet_name] = combined_data
    
    return data

# İnterpolasyon fonksiyonu
def interpolate_volume(data, tip, target_volume):
    if not tip.startswith("tip"):
        tip = f"tip{tip}"
    
    if tip not in data:
        raise ValueError(f"Tip '{tip}' bulunamadı. Lütfen geçerli bir tip girin.")
    
    df = data[tip]
    x = df['дм.куб'].values
    y = df['См'].values
    
    if len(set(x)) == 1:
        raise ValueError(f"Tip '{tip}' için hacim değerleri sabit. İnterpolasyon yapılamaz.")
    
    f = interp1d(x, y, kind='linear', fill_value="extrapolate")
    result_cm = f(target_volume)
    
    if result_cm.ndim == 0:
        return result_cm
    else:
        return result_cm[0]

# Ana sayfa
@app.route("/", methods=["GET", "POST"])
def index():
    file_path = "TIPLER.xlsx"  # Excel dosyasının yolu
    data = load_data(file_path)
    
    if request.method == "POST":
        try:
            tip = request.form.get("tip").strip()
            weight_kg = float(request.form.get("weight"))
            density = float(request.form.get("density"))
            
            # Hacmi hesapla
            target_volume = weight_kg / density
            
            # İnterpolasyon işlemini gerçekleştir
            result_cm = interpolate_volume(data, tip, target_volume)
            
            # Sonuçları JSON formatında döndür
            return jsonify({
                "status": "success",
                "volume": f"{target_volume:.2f}",
                "result": f"{result_cm:.2f}"
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=False)
