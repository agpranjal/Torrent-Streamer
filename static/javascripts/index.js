function getStatus() {
    let statusXhttp = new XMLHttpRequest();
    statusXhttp.onreadystatechange = function() {
        if (statusXhttp.readyState === 4 && statusXhttp.status === 200) {
            let data = JSON.parse(this.responseText);

            document.getElementById("downloaded").innerHTML = `Downloaded: ${data.downloaded} MB | `;
            document.getElementById("progress").innerHTML = `Progress: ${data.progress} %`;
        }
    };

    let t = document.getElementById("magnet").value;
    statusXhttp.open("GET", `/status/${t}/`, true);
    statusXhttp.send();
}


function torrent(e) {
    e.preventDefault();

    // open the ajax request to server for regular status updates
    // Also, show the status at the navbar
    document.getElementById("status-container").style.display = true;

    // After torrent URI submission, hide the submit button
    // And load the "loading" animated button
    document.getElementById("submit").style.display = "none";
    document.getElementById("magnet").disabled = true;
    document.getElementById("loading-button").style.display = "block";

    let inputData = document.getElementById("magnet");
    let xhttp = new XMLHttpRequest();

    // Make AJAX request to server for all the files in the submitted torrent URI
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            let ul = document.getElementById("magnet-links");
            ul.innerHTML = "<h4 style='text-decoration: underline;' class='text-center text-success mb-3 font-weight-bold'>Available files</h4>";

            data.forEach(function(link) {
                let e = document.createElement("li");
                let a = document.createElement("a");

                if (link.endsWith(".mp4") || link.endsWith(".webm"))
                    a.href = `/stream/${magnetUri}/${link}/`;
                a.innerHTML = `${link}`;

                // When user clicks one of the availale mp4/webm files, stream it
                a.onclick = function() {
                    document.querySelector("video").style.display = "block";
                    document.querySelector("video").src = `/stream/${magnetUri}/${link}/`;
                    plyr.setup("#plyr-video");
                    document.querySelector("video").style.height = "100%";
                };

                e.class = "list-group-items";
                e.appendChild(a);
                ul.appendChild(e);

            });

            // every second, request the server for download and progress status
            // request only when infohash has been submitted
            setInterval(getStatus, 1*1000);
        
            // When the torrent has loaded, hide both the input field and sample torrents
            document.getElementById("form").style.display = "none";
            document.getElementById("sample-torrents-container").style.display = "none";
        }

    };

    let magnetUri = inputData.value.trim();
    xhttp.open("GET", `/add/${magnetUri}/`, true);
    xhttp.send();
}

// ******************************************************************************

// When user clicks one of the sample torrent
// replace the torrent URI input field
document.querySelectorAll(".sample-torrent").forEach(function(e) {
    e.onclick = function() {
        document.getElementById("magnet").value = this.lastChild.nodeValue.trim();
    };
});


// When user submits the torrent URI
document.getElementById("form").onsubmit = torrent;
