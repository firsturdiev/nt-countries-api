// Globals

const API_BASE_URL = 'https://restcountries.com/v3.1';

// DOM elements

const elCountries = document.querySelector('.countries-list');
const elCountryTemp = document.querySelector('#countryTemp').content;
const elCountryModal = document.querySelector('#countryModal');
const elSearchForm = document.querySelector('.search-form');
const elSearchFormInput = elSearchForm.querySelector('.search-form__input');
const elSearchFormSelect = elSearchForm.querySelector('.search-form__select');

// Functions

function getJSON(url, successFn, errorFn = null) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 404)
        errorFn();
      else
        successFn(data);
    });
}

function showCountries(data) {
  elCountries.innerHTML = '';
  const elCountriesFragment = new DocumentFragment();

  for (let country of data.slice(0, 100)) {
    let elCountry = elCountryTemp.cloneNode(true);
    elCountry.querySelector('.country__img').src = country.flags.png;
    elCountry.querySelector('.country__img').alt = country.flags.png;
    elCountry.querySelector('.country__title').textContent = country.name.common;
    elCountry.querySelector('.country__title').title = country.name.common;
    elCountry.querySelector('.country__info-item--population').textContent = country.population;
    elCountry.querySelector('.country__info-item--region').textContent = country.region;
    elCountry.querySelector('.country__info-item--capital').textContent = country.capital;
    elCountry.querySelector('.js-more-info').dataset.uniqueId = country.cca3;

    elCountriesFragment.append(elCountry)
  }

  elCountries.append(elCountriesFragment);
}

function showError() {
  elCountries.innerHTML = 'No country found';
}

function updateInfoModal(country) {
  country = country[0];
  elCountryModal.querySelector('.country__img').src = country.flags.png;
  elCountryModal.querySelector('.country__img').alt = country.flags.png;
  elCountryModal.querySelector('.country__title').textContent = country.name.common;
  elCountryModal.querySelector('.country__title').title = country.name.common;
  elCountryModal.querySelector('.country__info-item--region').textContent = country.region;
  elCountryModal.querySelector('.country__info-item--currency').textContent = Object.keys(country.currencies).join(', ');
  elCountryModal.querySelector('.country__info-item--borders').textContent = country.borders.join(', ');
}

function clearInfoModal() {
  elCountryModal.querySelector('.country__img').src = null;
  elCountryModal.querySelector('.country__title').textContent = null;
  elCountryModal.querySelector('.country__info-item--population').textContent = null;
  elCountryModal.querySelector('.country__info-item--region').textContent = null;
  elCountryModal.querySelector('.country__info-item--capital').textContent = null;
}

// Event listeners

elCountries.addEventListener('click', (e) => {
  if (e.target.matches('.js-more-info'))
    getJSON(`${API_BASE_URL}/alpha/${e.target.dataset.uniqueId}`, updateInfoModal);
});

elCountryModal.addEventListener('hide.bs.modal', clearInfoModal);

elSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getJSON(`${API_BASE_URL}/name/${elSearchFormInput.value.trim()}`, showCountries, showError)
})

elSearchFormSelect.addEventListener('change', () => {
  getJSON(`${API_BASE_URL}/region/${elSearchFormSelect.value}`, showCountries);
})

// Initialization

getJSON(`${API_BASE_URL}/all`, showCountries);