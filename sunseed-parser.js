pmc_data_length = 50;
spm_data_length = 14;

var pmc = function (data, callback) {
  data = data.toString().slice(0, -1).split(",");
  data.shift();

  if (data.length != pmc_data_length) {
    callback(new Error('Incorrect data length!'));
  }
  else {
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
      "Phase_1_voltage_THD+N",
      "Phase_2_voltage_THD+N",
      "Phase_3_voltage_THD+N",
      "Phase_1_current_THD+N",
      "Phase_2_current_THD+N",
      "Phase_3_current_THD+N",
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
      "Measured_Temperature"];

    var field_units = ["V",
      "V",
      "V",
      "A",
      "A",
      "A",
      "A",
      "Hz",
      "angle_°",
      "angle_°",
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
      "°C"];

    var formated = [];

    for (var i = 0; i < pmc_data_length; i++) {
      formated.push({"name":field_descriptions[i], "value":data[i], "unit":field_units[i]});
    }

    callback(null, JSON.stringify(formated));
  }
}

var spm = function (data, callback) {
  data = data.toString().slice(0, -1).split(",");
  data.shift();

  if (data.length != spm_data_length) {
    callback(new Error('Incorrect data length!'));
  }
  else {
    var field_descriptions = ["Week_index",
      "Second_in_week",
      "Number_of_the_report",
      "Phase_1_Magnitude",
      "Phase_2_Magnitude",
      "Phase_3_Magnitude",
      "Phase_1_Angle",
      "Phase_2_Angle",
      "Phase_3_Angle",
      "Phase_1_Frequency",
      "Phase_2_Frequency",
      "Phase_3_Frequency",
      "Status_GPS_Reference_clock",
      "Transient"];

    var field_units = ["No_Unit",
      "s",
      "No_Unit",
      "V",
      "V",
      "V",
      "°",
      "°",
      "°",
      "Hz",
      "Hz",
      "Hz",
      "0_or_1",
      "0_or_1"];

    var formated = [];

    for (var i = 0; i < spm_data_length; i++) {
      formated.push({"name":field_descriptions[i], "value":data[i], "unit":field_units[i]});
    }

    callback(null, JSON.stringify(formated));
  }
}

exports.pmc = pmc;
exports.spm = spm;
