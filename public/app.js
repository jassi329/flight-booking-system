const apiOutput = document.querySelector('#apiOutput');
const apiStatus = document.querySelector('#apiStatus');
const flightResults = document.querySelector('#flightResults');
const apiBaseUrlInput = document.querySelector('#apiBaseUrl');
const saveApiBaseButton = document.querySelector('#saveApiBase');

function normalizeApiBaseUrl(value) {
    return value.trim().replace(/\/$/, '');
}

function getApiBaseUrl() {
    return normalizeApiBaseUrl(localStorage.getItem('flightApiBaseUrl') || '');
}

apiBaseUrlInput.value = getApiBaseUrl();

function showOutput(payload) {
    apiOutput.textContent = JSON.stringify(payload, null, 2);
}

function formToObject(form) {
    const data = new FormData(form);
    const payload = {};

    for (const [key, value] of data.entries()) {
        if (value !== '') {
            payload[key] = value;
        }
    }

    return payload;
}

function toQueryString(form) {
    const params = new URLSearchParams();
    const data = formToObject(form);

    Object.entries(data).forEach(([key, value]) => {
        params.append(key, value);
    });

    const query = params.toString();
    return query ? `?${query}` : '';
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const body = await response.json();
    showOutput(body);

    if (!response.ok) {
        throw new Error(body?.error?.message || body?.message || 'Request failed');
    }

    return body;
}

function showOffline(error) {
    apiStatus.textContent = 'API Offline';
    apiStatus.classList.add('fail');
    apiStatus.classList.remove('ok');
    showOutput({
        success: false,
        message: 'Frontend is online, but the API request failed.',
        apiBaseUrl: getApiBaseUrl() || 'same origin',
        endpoint: `${getApiBaseUrl()}/api/v1/info`,
        error: error.message
    });
}

function formatDate(value) {
    if (!value) return 'Not available';
    return new Date(value).toLocaleString();
}

function getAirportLabel(airport) {
    if (!airport) return 'Not available';
    const city = airport.City?.name ? `, ${airport.City.name}` : '';
    return `${airport.code || airport.name}${city}`;
}

function renderFlights(flights) {
    if (!Array.isArray(flights) || flights.length === 0) {
        flightResults.innerHTML = '<div class="empty">No flights found.</div>';
        return;
    }

    flightResults.innerHTML = flights.map((flight) => `
        <article class="flight-card">
            <header>
                <div>
                    <div class="flight-number">${flight.flightNumber}</div>
                    <div>${getAirportLabel(flight.departureAirport)} to ${getAirportLabel(flight.arrivalAirport)}</div>
                </div>
                <div class="price">Rs. ${flight.price}</div>
            </header>
            <div class="flight-meta">
                <span>Departure: ${formatDate(flight.departureTime)}</span>
                <span>Arrival: ${formatDate(flight.arrivalTime)}</span>
                <span>Seats: ${flight.totalSeats}</span>
                <span>Gate: ${flight.boardingGate || 'Not assigned'}</span>
            </div>
        </article>
    `).join('');
}

async function loadFlights(query = '') {
    try {
        const body = await apiRequest(`/api/v1/flights${query}`);
        renderFlights(body.data);
    } catch (error) {
        flightResults.innerHTML = `<div class="empty">${error.message}</div>`;
    }
}

async function checkApiStatus() {
    try {
        await apiRequest('/api/v1/info');
        apiStatus.textContent = 'API Online';
        apiStatus.classList.add('ok');
        apiStatus.classList.remove('fail');
    } catch (error) {
        showOffline(error);
    }
}

function attachJsonForm(formId, endpoint, afterSuccess) {
    const form = document.querySelector(formId);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = formToObject(form);

        try {
            await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            form.reset();
            if (afterSuccess) afterSuccess();
        } catch (error) {
            showOutput({ success: false, message: error.message });
        }
    });
}

document.querySelector('#flightSearchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    loadFlights(toQueryString(event.currentTarget));
});

document.querySelector('#refreshFlights').addEventListener('click', () => {
    loadFlights();
});

saveApiBaseButton.addEventListener('click', () => {
    const apiBaseUrl = normalizeApiBaseUrl(apiBaseUrlInput.value);
    localStorage.setItem('flightApiBaseUrl', apiBaseUrl);
    checkApiStatus();
    loadFlights();
});

attachJsonForm('#createAirplaneForm', '/api/v1/airplanes');
attachJsonForm('#createCityForm', '/api/v1/cities');
attachJsonForm('#createAirportForm', '/api/v1/airports');
attachJsonForm('#createFlightForm', '/api/v1/flights', () => loadFlights());

checkApiStatus();
loadFlights();
