const API_KEY = 'at_cu4hfDxm1O4NN25Gez1wGkXacpny2';
const IP_API_URL = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`;
const MAP_BOX_API_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
const MAP_BOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid2FzaGluZ3RvbjI5OSIsImEiOiJja2dzaTNkMjEwNDM0MzFvZnNnNTNxNjNvIn0.c0RymMFd_Q9NADrTGZh7wg';

const button = document.querySelector('.header__button');
const ip_address = document.querySelector('.header__ip-address');
const region = document.querySelector('.header__ip-location');
const timezone = document.querySelector('.header__ip-timezone');
const isp = document.querySelector('.header__ip-isp');

const mymap = L.map('mapid');
const marker = L.marker([0, 0]).addTo(mymap);

function displayMap(lat, lng) {
  mymap.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);

  L.tileLayer(MAP_BOX_API_URL, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAP_BOX_ACCESS_TOKEN,
  }).addTo(mymap);
  marker.bindPopup(`<b>${region.textContent}</b>`).openPopup();
}

(function() {
  const res = fetch(`${IP_API_URL}`, { method: 'GET' })
                .then(res => res.json())
                .catch(() => console.error('Request failed'));

  res
    .then(res => {
      const lat = res.location.lat;
      const lng = res.location.lng;

      ip_address.innerHTML = res.ip;
      region.innerHTML = res.location.city;
      timezone.innerHTML = `UTC ${res.location.timezone}`;
      isp.innerHTML = res.isp;

      displayMap(lat, lng);
    })
    .catch(() => console.error('Ip request failed'));
})();

function getGeoLocation() {
  const form = document.querySelector('.header__form');
  const input = document.querySelector('.header__input');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const regexp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!regexp.test(input.value)) {
      alert('you have entered an invalid IP address!!');
      input.value = '';
      return;
    }

    const res = fetch(`${IP_API_URL}&ipAddress=${input.value}`)
                  .then(res => res.json())
                  .catch(() => console.error("Ip request failed"));
    res
      .then(res => {
        const lat = res.location.lat;
        const lng = res.location.lng;

        ip_address.innerHTML = res.ip;
        region.innerHTML = res.location.city;
        timezone.innerHTML = `UTC ${res.location.timezone}`;
        isp.innerHTML = res.isp;

        displayMap(lat, lng);
      })
      .catch(() => console.error('Ip request failed'));
  });
}

button.addEventListener('click', getGeoLocation());