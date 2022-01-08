const MAX_CONTRIBUTION = 20500;

function updateTextView(_obj) {
  var num = getNumber(_obj.val());
  if (num == 0) {
    _obj.val("");
  } else {
    _obj.val(num.toLocaleString());
  }
}

function getNumber(_str) {
  var arr = _str.split("");
  var out = new Array();
  for (var cnt = 0; cnt < arr.length; cnt++) {
    if (isNaN(arr[cnt]) == false) {
      out.push(arr[cnt]);
    }
  }
  return Number(out.join(""));
}

$(document).ready(function () {
  $("input[type=text]").on("keyup", function () {
    updateTextView($(this));
  });
});

function calculateMatches() {
  var salary = getNumber(document.getElementById("annual_gross").value) || 0;
  var paychecks = getNumber(document.getElementById("paychecks").value) || 0;

  var bonusPercentage =
    getNumber(document.getElementById("bonus_percentage").value) / 100 || 0;
  var bonusPayout =
    getNumber(document.getElementById("bonus_payout").value) / 100 || 0;

  var companyMatch =
    getNumber(document.getElementById("company_match").value) / 100 || 0;
  var companyCap =
    getNumber(document.getElementById("company_cap").value) / 100 || 0;

  var bonus = calculateBonus(salary, bonusPercentage, bonusPayout);

  // Contribute minimum for match on bonus (i.e., contirbute cap)
  var bonusContribution = calculateContribution(bonus, companyCap);

  var remainingContribution = MAX_CONTRIBUTION - bonusContribution;
  var idealContributionPerPaycheck = contributionPerPaycheck(
    remainingContribution,
    paychecks
  );
  var grossPayment = calculatePaycheck(salary, paychecks);

  var maxPercentage = contributionPercentage(
    idealContributionPerPaycheck,
    grossPayment
  );
  var actualMaxContribution = floorContributionPercentage(maxPercentage);

  var finalMatch =
    salary * companyMatch * companyCap + bonus * companyMatch * companyCap;
  var total = bonus + salary + finalMatch;

  document.getElementById("final_annual_gross").value = salary.toLocaleString();
  document.getElementById("final_bonus").value = bonus.toLocaleString();
  document.getElementById("final_matching").value = finalMatch.toLocaleString();
  document.getElementById("final_total").value = total.toLocaleString();

  var minimumMatch = companyCap * 100;
  document.getElementById("bonus_match1").value = minimumMatch;
  document.getElementById("min_match").value = minimumMatch;
  document.getElementById("max_match1").value = actualMaxContribution * 100;

  var realContributionPerPaycheck = calculateContribution(
    grossPayment,
    actualMaxContribution
  );
  var totalContributionBeforeFinalPaycheck =
    realContributionPerPaycheck * (paychecks - 1);
  var contributionLeft =
    MAX_CONTRIBUTION - totalContributionBeforeFinalPaycheck;

  var idealMinimumFinalContribution = contributionPercentage(
    contributionLeft,
    grossPayment
  );
  var realMinimumFinalContribution = ceilingContributionPercentage(
    idealMinimumFinalContribution
  );

  document.getElementById("bonus_match2").value = minimumMatch;
  document.getElementById("max_match2").value = actualMaxContribution * 100;
  document.getElementById("final_max_match").value = (
    realMinimumFinalContribution * 100
  ).toFixed(0);

  var minContribution = MAX_CONTRIBUTION - grossPayment - bonusContribution;
  var minIdealContributionPerPaycheck = contributionPerPaycheck(
    MAX_CONTRIBUTION - bonusContribution - minContribution,
    paychecks - 1
  );
  var minIdealContributionPercentage = contributionPercentage(
    minIdealContributionPerPaycheck,
    grossPayment
  );
  var minRealContributionPercentage = ceilingContributionPercentage(
    minIdealContributionPercentage
  );

  document.getElementById("bonus_match3").value = minimumMatch;
  document.getElementById("min_raise_match").value = (
    minRealContributionPercentage * 100
  ).toFixed(0);
  document.getElementById("final_raise_max_match").value = 100;
}

function calculateBonus(salary, bonusPercentage, bonusPayout) {
  return salary * bonusPercentage * bonusPayout;
}

function calculateContribution(paycheck_amount, contribution_percentage) {
  // '''Calculate actual dollar contribution from gross paycheck amount and contribution percentage'''
  return paycheck_amount * contribution_percentage;
}

function calculatePaycheck(annual_salary, paychecks) {
  // '''Calculates gross paycheck when paid twice-monthly'''
  return annual_salary / paychecks;
}

function contributionPerPaycheck(total_contribubtion, remaining_pay_periods) {
  // '''Calculates equal dollar amounts to contribute per remaining pay periods'''
  return total_contribubtion / remaining_pay_periods;
}

function contributionPercentage(dollar_contribution, paycheck_amount) {
  // '''Calculates ideal contribution percentage given dollar contribution and gross paycheck'''
  return dollar_contribution / paycheck_amount;
}

function floorContributionPercentage(contribution_percentage) {
  // '''Calculates floor of percentage'''
  return Math.floor(contribution_percentage * 100) / 100;
}

function ceilingContributionPercentage(contribution_percentage) {
  var percentage = contribution_percentage * 100;
  var ceiling = Math.ceil(percentage);
  var finalFloat = ceiling / 100;
  return finalFloat;
}

function reset() {
  document.getElementById("annual_net").value = 0;
  document.getElementById("annual_gross").value = 0;
  document.getElementById("month_net").value = 0;
  document.getElementById("month_gross").value = 0;
  document.getElementById("hourly_net").value = 0;
  document.getElementById("hourly_gross").value = 0;
}

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
        and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
