let getStatusVar;

function getStatus() {
    let statusXhttp = new XMLHttpRequest();
    statusXhttp.onreadystatechange = function() {
        if (statusXhttp.readyState === 4 && statusXhttp.status === 200) {
            let data = JSON.parse(this.responseText);

            document.getElementById("downloaded").innerHTML = `Downloaded: ${data.downloaded} MB`;
            document.getElementById("progress").innerHTML = `Progress: ${data.progress} %`;
        }
    };

    statusXhttp.open("GET", `/status/${currentMagnetUri}/`, true);
    statusXhttp.send();
}


function torrent(e) {
    e.preventDefault();

    // open the ajax request to server for regular status updates
    // Also, show the status at the navbar
    document.getElementById("status-container").style.display = "block";

    // After torrent URI submission.......
    // Change the UI a little bit
    document.getElementById("submit").style.display = "none";
    document.getElementById("loading-button").style.display = "block";
    document.getElementById("delete-torrent-btn").style.display = "block";
    document.getElementById("open-pirates-bay-btn").style.display = "none";

    let xhttp = new XMLHttpRequest();

    // Make AJAX request to server to fetch all the files in the submitted torrent URI
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            let ul = document.getElementById("torrent-files");
            ul.innerHTML = "<h4 style='text-decoration: underline;' class='text-success mb-3 mt-4 font-weight-bold'>Available files</h4>";

            data.forEach(function(link) {
                let e = document.createElement("li");
                let a = document.createElement("a");

                if (link.endsWith(".mp4") || link.endsWith(".webm"))
                    a.href = `/stream/${currentMagnetUri}/${link}/`;
                a.innerHTML = `${link}`;

                // When user clicks one of the availale mp4/webm files, stream it
                a.onclick = function() {
                    document.querySelector("video").src = `/stream/${currentMagnetUri}/${link}/`;
                    document.getElementById("video-container").style.display = "block";

                    plyr.setup("#plyr-video");
                };

                e.class = "list-group-items";
                e.appendChild(a);
                ul.appendChild(e);
                ul.style.display = "block";
            });

            // every second, request the server for download and progress status
            // request only when infohash has been submitted
            getStatusVar = setInterval(getStatus, 1*1000);
        
            // When the torrent has loaded, hide both the input field and sample torrents
            //document.getElementById("form").style.display = "none";
            document.getElementById("magnet-uri-container").style.display = "none";
            document.getElementById("sample-torrents-container").style.display = "none";
        }

    };

    currentMagnetUri = document.getElementById("magnet").value.trim();
    xhttp.open("GET", `/add/${currentMagnetUri}/`, true);
    xhttp.send();
}

// ******************************************************************************

let currentMagnetUri;

// When user clicks one of the sample torrent
// replace the torrent URI input field
document.querySelectorAll(".sample-torrent").forEach(function(e) {
    e.onclick = function() {
        document.getElementById("magnet").value = this.lastChild.nodeValue.trim();
    };
});


// When user submits the torrent URI
document.getElementById("form").onsubmit = torrent;

// When user clicks the delete torrent button
document.getElementById("delete-torrent-btn").onclick = function() {

    // stop the getStatus function
    clearInterval(getStatusVar);

    // pause the video
    document.querySelector("video").pause();

    let deleteXhttp = new XMLHttpRequest();
    deleteXhttp.onreadystatechange = function() {
        if (deleteXhttp.readyState === 4 && deleteXhttp.status === 200) {

            // revert the UI back to the initial state (ie, when the page was first loaded)
            document.getElementById("sample-torrents-container").style.display = "block";
            document.getElementById("delete-torrent-btn").style.display = "none";
            document.getElementById("open-pirates-bay-btn").style.display = "block";
            document.getElementById("video-container").style.display = "none";
            document.getElementById("torrent-files").style.display = "none";
            document.getElementById("loading-button").style.display = "none";
            document.getElementById("submit").style.display = "block";
            document.getElementById("magnet-uri-container").style.display = "block";
            document.getElementById("status-container").style.display = "none";
            document.getElementById("downloaded").innerHTML = "";
            document.getElementById("progress").innerHTML = "";
        }

    };

    deleteXhttp.open("GET", `/delete/${currentMagnetUri}/`, true);
    deleteXhttp.send();
       
};


