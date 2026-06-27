/*
Name: Taha Asmat
File: homework2.js
Date created: June 21st
Last edited: June 26th
Version: 1.0
Description: External JS for Houston Emergency Care HW2
*/

function formatMoney(value) {
  return '$' + Number(value).toFixed(0);
}

const healthLevel = document.getElementById('healthLevel');
const healthLevelValue = document.getElementById('healthLevelValue');
healthLevel.addEventListener('input', function () {
  healthLevelValue.textContent = this.value;
});

const salaryInput = document.getElementById('salary');
const salaryDisplay = document.getElementById('salaryDisplay');
salaryInput.addEventListener('input', function () {
  salaryDisplay.textContent = formatMoney(this.value);
});

const homeMin = document.getElementById('homeMin');
const homeMax = document.getElementById('homeMax');
const homeDisplay = document.getElementById('homePriceDisplay');

function updateHomeRange() {
  const minVal = Number(homeMin.value);
  const maxVal = Number(homeMax.value);
  let text = formatMoney(minVal) + ' - ' + formatMoney(maxVal);
  if (minVal > maxVal) {
    text += ' (Note: min is greater than max!)';
  }
  homeDisplay.textContent = text;
}

homeMin.addEventListener('input', updateHomeRange);
homeMax.addEventListener('input', updateHomeRange);
updateHomeRange();

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
    alert('Enter a real month, day, and year for your Date of Birth.');
    return false;
  }
  const today = new Date();
  if (dobDate > today) {
    alert("Date of Birth can't be in the future.");
    return false;
  }
  const oldestAllowed = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (dobDate < oldestAllowed) {
    alert('That birth year is more than 120 years ago - please double check it.');
    return false;
  }
  const dobMonthNum = dobDate.getMonth() + 1;
  const dobDayNum = dobDate.getDate();
  const dobMonthStr = dobMonthNum < 10 ? '0' + dobMonthNum : '' + dobMonthNum;
  const dobDayStr = dobDayNum < 10 ? '0' + dobDayNum : '' + dobDayNum;
  document.getElementById('dob').value = dobMonthStr + '/' + dobDayStr + '/' + dobDate.getFullYear();

  const symptoms = document.getElementById('symptoms').value;
  if (symptoms.indexOf('"') !== -1) {
    alert('No double quotes allowed in the symptoms box.');
    return false;
  }

  const checkedConditions = document.querySelectorAll('input[name="conditions"]:checked');
  if (checkedConditions.length === 0) {
    alert('Check at least one box under "Check all that apply."');
    return false;
  }

  const pword = document.getElementById('pword').value;
  const pword2 = document.getElementById('pword2').value;
  const userid = useridInput.value;
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;

  if (pword.indexOf('"') !== -1 || pword.indexOf("'") !== -1) {
    alert('No quote characters allowed in your password.');
    return false;
  }

  if (userid && pword.toLowerCase().indexOf(userid.toLowerCase()) !== -1) {
    alert("Your password can't contain your User ID.");
    return false;
  }

  if ((fname && pword.toLowerCase().indexOf(fname.toLowerCase()) !== -1) ||
      (lname && pword.toLowerCase().indexOf(lname.toLowerCase()) !== -1)) {
    alert("Your password can't contain your first or last name.");
    return false;
  }

  if (pword !== pword2) {
    alert("Those passwords don't match - try again.");
    return false;
  }

  return true;
}

const regForm = document.getElementById('regForm');
regForm.addEventListener('submit', function (event) {
  if (!validateForm()) {
    event.preventDefault();
  }
});

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
  for (let i = 0; i < f.gender.length; i++) {
    if (f.gender[i].checked) {
      gender = f.gender[i].value;
    }
  }

  const allConditions = ['ChickenPox', 'Measles', 'Covid19', 'SmallPox', 'Tetanus'];
  const checked = document.querySelectorAll('input[name="conditions"]:checked');
  const checkedValues = [];
  for (let i = 0; i < checked.length; i++) {
    checkedValues.push(checked[i].value);
  }

  let vaccinated = '(not selected)';
  for (let i = 0; i < f.vaccinated.length; i++) {
    if (f.vaccinated[i].checked) {
      vaccinated = f.vaccinated[i].value;
    }
  }
  let insurance = '(not selected)';
  for (let i = 0; i < f.insurance_radio.length; i++) {
    if (f.insurance_radio[i].checked) {
      insurance = f.insurance_radio[i].value;
    }
  }

  const healthLevelVal = f.healthLevel.value;
  const salaryVal = formatMoney(f.salary.value);
  const homePriceVal = formatMoney(f.homeMin.value) + ' - ' + formatMoney(f.homeMax.value);

  const userid = f.userid.value.toLowerCase();

  let html = '<h3>PLEASE REVIEW THIS INFORMATION</h3>';
  html += '<table class="form">';
  html += '<tr><th>First, MI, Last Name:</th><td>' + fname + ' ' + middle + ' ' + lname + '</td><td>' +
    (fname && lname ? 'pass' : 'ERROR: missing name') + '</td></tr>';
  html += '<tr><th>Date of Birth:</th><td>' + dobText + '</td><td>' + dobStatus + '</td></tr>';
  html += '<tr><th>Email address:</th><td>' + email + '</td><td>' + (email ? 'pass' : 'ERROR: missing email') + '</td></tr>';
  html += '<tr><th>Phone number:</th><td>' + phone + '</td><td>' + (phone ? 'pass' : 'ERROR: missing phone') + '</td></tr>';
  html += '<tr><th>Address:</th><td>' + address + (address2 ? ', ' + address2 : '') + ', ' + city + ', ' + state + ' ' + zipShort +
    '</td><td>' + ((address && city && state && zipFull) ? 'pass' : 'ERROR: missing address info') + '</td></tr>';
  html += '</table>';

  html += '<h3>REQUESTED INFO</h3>';
  html += '<table class="form">';
  for (let i = 0; i < allConditions.length; i++) {
    const cond = allConditions[i];
    html += '<tr><th>' + cond + ':</th><td>' + (checkedValues.indexOf(cond) !== -1 ? 'Y' : 'N') + '</td><td></td></tr>';
  }
  html += '<tr><th>Vaccinated?:</th><td>' + vaccinated + '</td><td></td></tr>';
  html += '<tr><th>Insurance?:</th><td>' + insurance + '</td><td></td></tr>';
  html += '<tr><th>Health Level:</th><td>' + healthLevelVal + ' / 100</td><td></td></tr>';
  html += '<tr><th>Desired Salary:</th><td>' + salaryVal + '</td><td></td></tr>';
  html += '<tr><th>Home Price Range:</th><td>' + homePriceVal + '</td><td></td></tr>';
  html += '<tr><th>Described Symptoms:</th><td>' + (symptoms || '(none entered)') + '</td><td></td></tr>';
  html += '<tr><th>User ID:</th><td>' + userid + '</td><td></td></tr>';
  html += '<tr><th>Password:</th><td>********</td><td>(not displayed for security)</td></tr>';
  html += '</table>';

  document.getElementById('reviewArea').innerHTML = html;
}

const reviewBtn = document.getElementById('reviewBtn');
reviewBtn.addEventListener('click', buildReview);
