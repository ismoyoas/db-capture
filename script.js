// Menangani pengiriman formulir query SQL
document.getElementById("query-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Mencegah form dikirim secara tradisional

    const query = document.getElementById("query").value;

    // Mendapatkan tanggal dan waktu lokal saat ini
    const now = new Date();
    const dateTime = now.toLocaleString();  // Menggunakan waktu lokal komputer

    // Mengirimkan query ke data.php dengan AJAX
    fetch('data.php', {
        method: 'POST',
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors.length > 0) {
            let errorHtml = "<div class='alert alert-danger mt-3'>";
            data.errors.forEach(error => {
                errorHtml += `<p>${error}</p>`;
            });
            errorHtml += "</div>";
            document.getElementById("errors").innerHTML = errorHtml;
        } else {
            document.getElementById("errors").innerHTML = "";  // Hapus error
            let resultsHtml = "";
            data.results.forEach(result => {                
                // Menambahkan keterangan jumlah kolom di atas tabel
                const columnCount = result.data.length > 0 ? Object.keys(result.data[0]).length : 0;                
                if (result.data.length > 0) {
                    resultsHtml += `<div class="table-container">
                        <table id="${result.id}" class="table table-bordered">
                            <thead>
                                <tr>`;

                    // Menampilkan header tabel dan menambahkan tombol sorting
                    resultsHtml += `<th>#</th>`; // Kolom Indeks Baris
                    Object.keys(result.data[0]).forEach((column, index) => {
                        resultsHtml += `<th onclick="sortTable(${index + 1}, '${result.id}')">${column} <span class="sort-icon">↑↓</span></th>`;
                    });
                    resultsHtml += `</tr></thead><tbody>`;

                    // Menampilkan data tabel dengan indeks baris untuk setiap baris
                    result.data.forEach((row, rowIndex) => {
                        resultsHtml += "<tr>";
                        resultsHtml += `<td>${rowIndex + 1}</td>`; // Menambahkan Indeks Baris
                        Object.values(row).forEach(value => {
                            resultsHtml += `<td>${value}</td>`;
                        });
                        resultsHtml += "</tr>";
                    });

                    // Menambahkan footer dengan catatan di bawah tabel
                    resultsHtml += `</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="${columnCount + 1}" style="text-align: left;">
                                    <strong>Query: ${result.query} <br>
                                    Captured by BRILink Surrounding DB Capture - 2024 (${dateTime}) </strong>
                                </td>
                            </tr>
                        </tfoot>`;

                    resultsHtml += `</table></div> <br>
                    <button class="btn btn-success download" id="download-${result.id}">Download Gambar</button> <br> <hr style="border-width:5px; border-color:black;">`;
                } else {
                    resultsHtml += `<p class='alert alert-warning'>Tidak ada data yang ditemukan untuk query ${result.query}.</p> <hr style='border-width:5px; border-color:black;'>`; 
                }
            });
            document.getElementById("results").innerHTML = resultsHtml;

            // Menambahkan event listener untuk tombol download gambar berdasarkan ID tabel
            data.results.forEach(result => {
                const downloadButton = document.getElementById(`download-${result.id}`);
                if (downloadButton) {
                    downloadButton.addEventListener("click", (e) => {
                        // Mengambil screenshot dari tabel
                        const imgName = "db-capture";  // Nama file otomatis
                        const tableId = result.id;  // Menggunakan ID dari tabel yang relevan
                        const element = document.getElementById(tableId);

                        // Mengambil screenshot dari tabel
                        html2canvas(element, {
                            scale: 2
                        }).then(function (canvas) {
                            const a = document.createElement("a");
                            a.download = imgName + ".png";
                            a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                            a.click();
                        });
                    });
                }
            });
        }
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
    });
});
