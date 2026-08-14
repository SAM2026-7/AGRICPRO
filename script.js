(function () {
  'use strict';

  var OPEN_DAY_START = 1; // Monday
  var OPEN_DAY_END = 5;   // Friday
  var OPEN_HOUR = 8;      // 8:00 AM
  var CLOSE_HOUR = 17;    // 5:00 PM

  var form = document.getElementById('booking-form');
  var message = document.getElementById('form-message');
  var statusEl = document.getElementById('status');
  var yearEl = document.getElementById('year');
  var vegOthers = document.getElementById('veg-others');
  var arableOthers = document.getElementById('arable-others');
  var perennialOthers = document.getElementById('perennial-others');
  var animalOthers = document.getElementById('animal-others');

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Crop chip toggle
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('checked');
    });
  });

  // Marketing hours status (8 AM - 5 PM, Mon - Fri)
  function updateStatus() {
    var now = new Date();
    var day = now.getDay();
    var hour = now.getHours();
    var isOpen = day >= OPEN_DAY_START && day <= OPEN_DAY_END && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    statusEl.textContent = isOpen ? 'We are OPEN now - 8 AM to 5 PM' : 'Currently closed - Open Mon - Fri, 8 AM to 5 PM';
    statusEl.classList.remove('open', 'closed');
    statusEl.classList.add(isOpen ? 'open' : 'closed');
  }

  updateStatus();
  setInterval(updateStatus, 60000);

  function showMessage(type, text) {
    message.hidden = false;
    message.className = 'form-message ' + type;
    message.textContent = text;
  }

  function hideMessage() {
    message.hidden = true;
    message.className = 'form-message';
    message.textContent = '';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideMessage();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var crop = document.getElementById('crop').value;
    var quantity = document.getElementById('quantity').value;
    var unit = document.getElementById('unit').value;
    var notes = document.getElementById('notes').value.trim();

    if (!name || !email || !phone || !crop || !quantity || !unit) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showMessage('error', 'Please enter a valid email address.');
      return;
    }

    if (!/^[0-9+\-() ]{7,16}$/.test(phone)) {
      showMessage('error', 'Please enter a valid phone number.');
      return;
    }

    if (Number(quantity) <= 0) {
      showMessage('error', 'Quantity must be greater than zero.');
      return;
    }

    // Collect chips
    var selectedCrops = [];
    chips.forEach(function (chip) {
      var input = chip.querySelector('input');
      if (input.checked) {
        selectedCrops.push(input.value);
      }
    });
    if (vegOthers.value.trim()) {
      selectedCrops.push(vegOthers.value.trim());
    }
    if (arableOthers.value.trim()) {
      selectedCrops.push(arableOthers.value.trim());
    }
    if (perennialOthers.value.trim()) {
      selectedCrops.push(perennialOthers.value.trim());
    }
    if (animalOthers.value.trim()) {
      selectedCrops.push(animalOthers.value.trim());
    }

    var summary = [
      'BOOKING SUMMARY',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + phone,
      'Crop: ' + crop,
      'Quantity: ' + quantity + ' ' + unit,
      'Other crops: ' + (selectedCrops.length ? selectedCrops.join(', ') : 'None'),
      'Notes: ' + (notes || 'None'),
      'Commission: ECOBANK ACCT 4331097600'
    ].join('\n');

    console.log(summary);

    showMessage('success', 'Booking submitted! Our team will contact you at ' + phone + ' within marketing hours (Mon - Fri, 8 AM - 5 PM).');

    form.reset();
    chips.forEach(function (chip) {
      chip.classList.remove('checked');
    });
  });
})();
