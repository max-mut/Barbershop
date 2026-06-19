function filterServices(category) {

    const rows = document.querySelectorAll("#services-table tr");
    let visibleCount = 0;

    document.querySelectorAll("[data-filter]").forEach(button => {
        button.classList.remove("active");
    });

    document
        .querySelector(`[data-filter="${category}"]`)
        .classList.add("active");

    rows.forEach(row => {

        if (category === "all" || row.dataset.category === category) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }

    });

    const noResults = document.getElementById("no-results");

    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}