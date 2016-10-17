fs = require('fs');

pmc_data_length = 53;
spm_data_length = 20;
pmc_file_name = "/tmp/pmc-data"
spm_file_name = "/tmp/spm-data"
write_to_file = true;
allow_toggle = true;
input_status = [];

var toggle = function (output, callback) {
  if (allow_toggle) {
    allow_toggle = false;
    response = ['PMCR1'];

    if (output.length == 3 && (output[0] == 0 || output[0] == 1) &&
    (output[1] == 0 || output[1] == 1) &&
    (output[2] == 0 || output[2] == 1)) {
      if (input_status[0] == output[0]) {
        response.push(0);
      } else {
        response.push(1);
      }
      if (input_status[1] == output[1]) {
        response.push(0);
      } else {
        response.push(1);
      }
      if (input_status[2] == output[2]) {
        response.push(0);
      } else {
        response.push(1);
      }

      if (response[1] == 0 && response[2] == 0 && response[3] == 0) {
        allow_toggle = true;
        return callback(new Error('No change!'));
      } else {
        setTimeout(function () {
          callback(null, response.join(',') + "\n");
        }, 10);
        setTimeout(function() { allow_toggle = true; }, 15000);
      }
    } else {
      allow_toggle = true;
      return callback(new Error('Wrong output settings!'));
    }
  } else {
    return callback(new Error('Wait at most 15 seconds before retry!'));
  }
}

var pmc = function (data, callback) {
  data = data.toString().split(",");
  data.shift();

  if (data.length != pmc_data_length) {
    callback(new Error('Incorrect data length!'));
  }
  else {
    input_status = data.slice(-3).map(Number);
    var field_descriptions = ["Phase_1_voltage_RMS",
      "Phase_2_voltage_RMS",
      "Phase_3_voltage_RMS",
      "Phase_1_current_RMS",
      "Phase_2_current_RMS",
      "Phase_3_current_RMS",
      "N_Line_calculated_current_RMS",
      "Phase_1_Frequency",
      "Phase_2_voltage_phase",
      "Phase_3_voltage_phase",
      "Phase_1_voltage_THD_N",
      "Phase_2_voltage_THD_N",
      "Phase_3_voltage_THD_N",
      "Phase_1_current_THD_N",
      "Phase_2_current_THD_N",
      "Phase_3_current_THD_N",
      "Phase_1_Active_Power",
      "Phase_2_Active_Power",
      "Phase_3_Active_Power",
      "Phase_1_Reactive_Power",
      "Phase_2_Reactive_Power",
      "Phase_3_Reactive_Power",
      "Phase_1_Apparent_power",
      "Phase_2_Apparent_power",
      "Phase_3_Apparent_power",
      "Phase_1_power_factor",
      "Phase_2_power_factor",
      "Phase_3_power_factor",
      "Phase_1_active_fundamental",
      "Phase_2_active_fundamental",
      "Phase_3_active_fundamental",
      "Phase_1_active_harmonic",
      "Phase_2_active_harmonic",
      "Phase_3_active_harmonic",
      "Phase_1_Forward_Active",
      "Phase_2_Forward_Active",
      "Phase_3_Forward_Active",
      "Phase_1_Reverse_Active",
      "Phase_2_Reverse_Active",
      "Phase_3_Reverse_Active",
      "Phase_1_Forward_Reactive",
      "Phase_2_Forward_Reactive",
      "Phase_3_Forward_Reactive",
      "Phase_1_Reverse_Reactive",
      "Phase_2_Reverse_Reactive",
      "Phase_3_Reverse_Reactive",
      "Phase_1_Apparent_Energy",
      "Phase_2_Apparent_Energy",
      "Phase_3_Apparent_Energy",
      "Measured_Temperature",
      "Input_1_Status",
      "Input_2_Status",
      "Input_3_Status"];

    var field_units = ["V",
      "V",
      "V",
      "A",
      "A",
      "A",
      "A",
      "Hz",
      "deg",
      "deg",
      "%",
      "%",
      "%",
      "%",
      "%",
      "%",
      "W",
      "W",
      "W",
      "kvar",
      "kvar",
      "kvar",
      "VA",
      "VA",
      "VA",
      "No_Unit",
      "No_Unit",
      "No_Unit",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "Wh",
      "degC",
      "1_high_or_0_low",
      "1_high_or_0_low",
      "1_high_or_0_low"];

    var formated = [];

    for (var i = 0; i < pmc_data_length; i++) {
      formated.push({"name":field_descriptions[i], "value":parseFloat(data[i]), "unit":field_units[i]});
    }

    formated_data = JSON.stringify(formated);

    if (write_to_file) {
      fs.writeFile(pmc_file_name, formated_data + "\n");
      write_to_file = false;
    }

    callback(null, formated_data);
  }
}

var spm = function (data, node_id, callback) {
  if (write_to_file) {
    spm_to_file(data);
  }

  data = data.toString().split(",");
  data.shift();

  if (data.length != spm_data_length) {
    callback(new Error('Incorrect data length!'));
  }
  else {
    var field_descriptions = ["week_id",
      "sec_id",
      "report_n",
      "v1",
      "v2",
      "v3",
      "psp_v",
      "th1",
      "th2",
      "th3",
      "psp_th",
      "f1",
      "f2",
      "f3",
      "f4",
      "status1",
      "status2",
      "status3",
      "status4",
      "GPSstatus"];

    var formated = {node_id: node_id};

    for (var i = 0; i < spm_data_length; i++) {
      formated[field_descriptions[i]] = parseFloat(data[i])
    }

    callback(null, JSON.stringify(formated));
  }
}

var spm_to_file = function (data) {
  data = data.toString().split(",");
  data.shift();

  if (data.length != spm_data_length) {
    return;
  }
  else {
    write_to_file = false;
    var field_descriptions = ["Week_index",
      "Second_in_week",
      "Number_of_the_report",
      "Phase_1_Magnitude",
      "Phase_2_Magnitude",
      "Phase_3_Magnitude",
      "psp_v",
      "Phase_1_Angle",
      "Phase_2_Angle",
      "Phase_3_Angle",
      "psp_th",
      "Phase_1_Frequency",
      "Phase_2_Frequency",
      "Phase_3_Frequency",
      "Phase_4_Frequency",
      "status1",
      "status2",
      "status3",
      "status4",
      "Status_GPS_Reference_clock"];

    var field_units = ["No_Unit",
      "s",
      "No_Unit",
      "V",
      "V",
      "V",
      "V",
      "deg",
      "deg",
      "deg",
      "deg",
      "Hz",
      "Hz",
      "Hz",
      "Hz",
      "0_or_1",
      "0_or_1",
      "0_or_1",
      "0_or_1",
      "0_or_1"];

    var formated = [];

    for (var i = 0; i < spm_data_length; i++) {
      formated.push({"name":field_descriptions[i], "value":parseFloat(data[i]), "unit":field_units[i]});
    }

    formated_data = JSON.stringify(formated);

    fs.writeFile(spm_file_name, formated_data + "\n");
  }
}

exports.pmc = pmc;
exports.spm = spm;
exports.toggle = toggle;
