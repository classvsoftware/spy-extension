console.log("index.js");

document.querySelector("#links").innerHTML = [
  ...document.querySelectorAll("section"),
]
  .map((section) => {
    const h1 = section.querySelector("h1");
    h1.classList.add(
      "border-b",
      "border-gray-500",
      "font-semibold",
      "text-gray-700",
      "text-2xl"
    );
    const title = h1.innerText;
    const href = title.replaceAll(/\W/g, "").toLocaleLowerCase();
    section.setAttribute("id", href);

    return `<a href="#${href}">${title}</a>`;
  })
  .join("");

// Geolocation

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude, accuracy } = pos.coords;

    const params = new URLSearchParams({
      bbox: `${longitude + 0.01},${latitude - 0.01},${longitude - 0.01},${
        latitude + 0.01
      }`,
      layer: "mapnik",
      marker: `${latitude},${longitude}`,
    });

    const src = new URL(
      `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
    ).toString();

    document.querySelector("#coordinates").innerHTML = `
    <div>Coordinates: ${latitude}, ${longitude}</div>
    <iframe
          id="geolocation"
          width="425"
          height="350"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="${src}"
          style="border: 1px solid black"
        ></iframe
        >
    `;

    document.querySelector("#geolocation").src = src;
  },
  (e) => {
    console.error(e);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }
);
