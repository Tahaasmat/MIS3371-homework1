/*
Name: Taha Asmat
File: homework2.js
Date created: June 21st
Last edited: June 26th
Version: 1.1
Description: JS for Houston Emergency Care HW2
*/

function formatMoney(value) {
  return '$' + Number(value).toFixed(0);
}

function pad2(n) {
  if (n < 10) {
    return '0' + n;
  }
  return '' + n;
}

const healthLevel = document.getElementById('healthLevel');
const healthLevelValue = document.getElementById('healthLevelValue');
if (healthLevel && healthLevelValue) {
  healthLevel.addEventListener('input', function () {
    healthLevelValue.textContent = this.value;
  });
}

const salaryInput = document.getElementById('salary');
const salaryDisplay = document.getElementById('salaryDisplay');
if (salaryInput && salaryDisplay) {
  salaryInput.addEventListener('input', function () {
    salaryDisplay.textContent = formatMoney(this.value);
  });
}

const homeMin = document.getElementById('homeMin');
const homeMax = document.getElementById('homeMax');
const homeDisplay = document.getElementById('homePriceDisplay');

function updateHomeRange() {
  if (!homeMin || !homeMax || !homeDisplay) return;
  const minVal = Number(homeMin.value);
  const maxVal = Number(homeMax.value);
  let text = formatMoney(minVal) + ' - ' + formatMoney(maxVal);
  if (minVal > maxVal) {
    text += ' (Note: min is greater than max!)';
  }
  homeDisplay.textContent = text;
}

if (homeMin && homeMax && homeDisplay) {
  homeMin.addEventListener('input', updateHomeRange);
  homeMax.addEventListener('input', updateHomeRange);
  updateHomeRange();
}

function getDobDate() {
  const month = parseInt(document.getElementById('dobMonth').value, 10);
  const day = parseInt(document.getElementById('dobDay').value, 10);
  const year = parseInt(document.getElementById('dobYear').value, 10);
  const dateObj = new Date(year, month - 1, day);
  if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
    return null;
  }
  return dateObj;
}

function validateForm() {
  const useridInput = document.getElementById('userid');
  if (useridInput.value) {
    useridInput.value = useridInput.value.toLowerCase();
  }

  const dobDate = getDobDate();
  if (!dobDate) {
    alert('Please enter a valid Date of Birth (a real month, day, and year).');
    return false;
  }
  const today = new Date();
  if (dobDate > today) {
    alert('Date of Birth cannot be in the future.');
    return false;
  }
  const oldestAllowed = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (dobDate < oldestAllowed) {
    alert('Date of Birth cannot be more than 120 years ago.');
    return false;
  }
  document.getElementById('dob').value =
    pad2(dobDate.getMonth() + 1) + '/' + pad2(dobDate.getDate()) + '/' + dobDate.getFullYear();

  const symptoms = document.getElementById('symptoms').value;
  if (symptoms.indexOf('"') !== -1) {
    alert('Please remove double quote characters from the symptoms description.');
    return false;
  }

  const checkedConditions = document.querySelectorAll('input[name="conditions"]:checked');
  if (checkedConditions.length === 0) {
    alert('Please select at least one item under "Check all that apply."');
    return false;
  }

  const pword = document.getElementById('pword').value;
  const pword2 = document.getElementById('pword2').value;
  const userid = useridInput.value;
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;

  if (pword.indexOf('"') !== -1 || pword.indexOf("'") !== -1) {
    alert('Passwords cannot contain quote characters.');
    return false;
  }

  if (userid && pword.toLowerCase().indexOf(userid.toLowerCase()) !== -1) {
    alert('Password cannot contain your User ID.');
    return false;
  }

  if ((fname && pword.toLowerCase().indexOf(fname.toLowerCase()) !== -1) ||
      (lname && pword.toLowerCase().indexOf(lname.toLowerCase()) !== -1)) {
    alert('Password cannot contain your first or last name.');
    return false;
  }

  if (pword !== pword2) {
    alert('Passwords do not match. Please re-enter them.');
    return false;
  }

  return true;
}

const regForm = document.getElementById('regForm');
if (regForm) {
  regForm.addEventListener('submit', function (event) {
    if (!validateForm()) {
      event.preventDefault();
    }
  });
}

function buildReview() {
  const f = document.regForm;

  const fname = f.fname.value;
  const middle = f.middle.value;
  const lname = f.lname.value;
  const dobDate = getDobDate();
  const dobText = dobDate
    ? (dobDate.getMonth() + 1) + '/' + dobDate.getDate() + '/' + dobDate.getFullYear()
    : '(incomplete)';
  const dobStatus = dobDate ? 'pass' : 'ERROR: invalid date';

  const email = f.email.value;
  const phone = f.phone.value;
  const address = f.address.value;
  const address2 = f.address2.value;
  const city = f.city.value;
  const state = f.state.value;
  const zipFull = f.zip.value;
  const zipShort = zipFull.slice(0, 5);

  const symptoms = f.symptoms.value;

  let gender = '(not selected)';
  for (const r of f.gender) {
    if (r.checked) gender = r.value;
  }

  const allConditions = ['ChickenPox', 'Measles', 'Covid19', 'SmallPox', 'Tetanus'];
  const checked = document.querySelectorAll('input[name="conditions"]:checked');
  const checkedValues = [];
  checked.forEach((c) => checkedValues.push(c.value));

  let vaccinated = '(not selected)';
  for (const r of f.vaccinated) {
    if (r.checked) vaccinated = r.value;
  }
  let insurance = '(not selected)';
  for (const r of f.insurance_radio) {
    if (r.checked) insurance = r.value;
  }

  const healthLevelVal = f.healthLevel.value;
  const salaryVal = formatMoney(f.salary.value);
  const homePriceVal = formatMoney(f.homeMin.value) + ' - ' + formatMoney(f.homeMax.value);

  const userid = f.userid.value.toLowerCase();

  let html = '<h3>PLEASE REVIEW THIS INFORMATION</h3>';
  html += '<table class="form">';
  html += row('First, MI, Last Name', fname + ' ' + middle + ' ' + lname, fname && lname ? 'pass' : 'ERROR: missing name');
  html += row('Date of Birth', dobText, dobStatus);
  html += row('Email address', email, email ? 'pass' : 'ERROR: missing email');
  html += row('Phone number', phone, phone ? 'pass' : 'ERROR: missing phone');
  html += row('Address', address + (address2 ? ', ' + address2 : '') + ', ' + city + ', ' + state + ' ' + zipShort,
              (address && city && state && zipFull) ? 'pass' : 'ERROR: missing address info');
  html += '</table>';

  html += '<h3>REQUESTED INFO</h3>';
  html += '<table class="form">';
  allConditions.forEach((cond) => {
    html += row(cond, checkedValues.indexOf(cond) !== -1 ? 'Y' : 'N', '');
  });
  html += row('Vaccinated?', vaccinated, '');
  html += row('Insurance?', insurance, '');
  html += row('Health Level', healthLevelVal + ' / 100', '');
  html += row('Desired Salary', salaryVal, '');
  html += row('Home Price Range', homePriceVal, '');
  html += row('Described Symptoms', symptoms || '(none entered)', '');
  html += row('User ID', userid, '');
  html += row('Password', '********', '(not displayed for security)');
  html += '</table>';

  document.getElementById('reviewArea').innerHTML = html;
}

function row(label, value, status) {
  return '<tr><th>' + label + ':</th><td>' + value + '</td><td>' + status + '</td></tr>';
}

const reviewBtn = document.getElementById('reviewBtn');
if (reviewBtn) {
  reviewBtn.addEventListener('click', buildReview);
}
