"use strict";

/**
 * Configuration for Login2Xplore JSONPowerDB
 */
const CONFIG = {
    CONNECTION_TOKEN: "YOUR_CONNECTION_TOKEN_HERE", // Replace with actual token
    DB_NAME: "SCHOOL-DB",
    RELATION_NAME: "STUDENT-TABLE",
    BASE_URL: "http://api.login2explore.com:5577",
    IRL_URI: "/api/irl",
    IML_URI: "/api/iml"
};

// State Elements
const els = {
    rollNo: $("#rollNo"),
    fullName: $("#fullName"),
    studentClass: $("#studentClass"),
    birthDate: $("#birthDate"),
    address: $("#address"),
    enrollmentDate: $("#enrollmentDate"),
    
    saveBtn: $("#saveBtn"),
    updateBtn: $("#updateBtn"),
    resetBtn: $("#resetBtn"),
    statusBadge: $("#status-message")
};

let currentRecordNo = null;

// Initialize form
$(document).ready(function () {
    resetForm();

    // Attach Event Listeners
    els.rollNo.on('blur', checkRollNoIsExist);
    els.saveBtn.on('click', saveData);
    els.updateBtn.on('click', updateData);
    els.resetBtn.on('click', resetForm);
});

/**
 * Resets the form to its initial empty state.
 */
function resetForm() {
    currentRecordNo = null;
    
    // Clear all fields
    els.rollNo.val("");
    els.fullName.val("");
    els.studentClass.val("");
    els.birthDate.val("");
    els.address.val("");
    els.enrollmentDate.val("");

    // Lock all fields except Roll No
    els.rollNo.prop("disabled", false);
    els.fullName.prop("disabled", true);
    els.studentClass.prop("disabled", true);
    els.birthDate.prop("disabled", true);
    els.address.prop("disabled", true);
    els.enrollmentDate.prop("disabled", true);

    // Disable all buttons
    els.saveBtn.prop("disabled", true);
    els.updateBtn.prop("disabled", true);
    els.resetBtn.prop("disabled", true);

    hideStatus();
    els.rollNo.focus();
}

/**
 * Retrieves data from the form and validates making sure no fields are empty.
 */
function getFormData() {
    const data = {
        "Roll-No": els.rollNo.val().trim(),
        "Full-Name": els.fullName.val().trim(),
        "Class": els.studentClass.val().trim(),
        "Birth-Date": els.birthDate.val().trim(),
        "Address": els.address.val().trim(),
        "Enrollment-Date": els.enrollmentDate.val().trim()
    };

    // Validation
    for (const key in data) {
        if (data[key] === "") {
            alert(`Please fill in the ${key.replace('-', ' ')} field.`);
            
            // Re-focus the empty element
            switch(key) {
                case "Roll-No": els.rollNo.focus(); break;
                case "Full-Name": els.fullName.focus(); break;
                case "Class": els.studentClass.focus(); break;
                case "Birth-Date": els.birthDate.focus(); break;
                case "Address": els.address.focus(); break;
                case "Enrollment-Date": els.enrollmentDate.focus(); break;
            }
            return null;
        }
    }
    return data;
}

/**
 * Event Handler: On Blur for Roll No field. Checks if Roll-No exists in JPDB.
 */
function checkRollNoIsExist() {
    const rollNoValue = els.rollNo.val().trim();
    if (rollNoValue === "") {
        return; // Wait for input
    }
    
    // Create GET_BY_KEY payload via jpdb-commons functionality
    const jsonStr = {
        "Roll-No": rollNoValue
    };
    const getRequest = createGET_BY_KEYRequest(
        CONFIG.CONNECTION_TOKEN, 
        CONFIG.DB_NAME, 
        CONFIG.RELATION_NAME, 
        JSON.stringify(jsonStr)
    );

    // Execute Request via AJAX
    jQuery.ajaxSetup({async: false});
    const responseObj = executeCommandAtGivenBaseUrl(getRequest, CONFIG.BASE_URL, CONFIG.IRL_URI);
    jQuery.ajaxSetup({async: true});

    // Check response status
    if (responseObj.status === 400) { // Not found - CREATE mode
        showStatus("New Record", "status-new");
        
        // Enable fields to write
        enableFormFields();
        els.rollNo.prop("disabled", false);
        
        // Enable Save & Reset buttons
        els.saveBtn.prop("disabled", false);
        els.updateBtn.prop("disabled", true);
        els.resetBtn.prop("disabled", false);
        
        els.fullName.focus();
        
    } else if (responseObj.status === 200) { // Found - UPDATE mode
        showStatus("Record Exists", "status-exist");
        
        // Parse the retrieved data
        const dataPayload = JSON.parse(responseObj.data);
        const record = dataPayload.record;
        
        // Save rec_no for updating later
        currentRecordNo = dataPayload.rec_no;

        // Populate fields
        els.fullName.val(record["Full-Name"]);
        els.studentClass.val(record["Class"]);
        els.birthDate.val(record["Birth-Date"]);
        els.address.val(record["Address"]);
        els.enrollmentDate.val(record["Enrollment-Date"]);

        // Disable PK, enable others
        enableFormFields();
        els.rollNo.prop("disabled", true);
        
        // Enable Update & Reset, disable Save
        els.saveBtn.prop("disabled", true);
        els.updateBtn.prop("disabled", false);
        els.resetBtn.prop("disabled", false);
        
        els.fullName.focus();
    }
}

/**
 * Event Handler: Save Data
 */
function saveData() {
    const formData = getFormData();
    if (formData === null) return; // Validation failed

    // Set loading state
    setLoading(els.saveBtn, true);

    const putRequest = createPUTRequest(
        CONFIG.CONNECTION_TOKEN,
        JSON.stringify(formData),
        CONFIG.DB_NAME,
        CONFIG.RELATION_NAME
    );

    jQuery.ajaxSetup({async: false});
    const responseObj = executeCommandAtGivenBaseUrl(putRequest, CONFIG.BASE_URL, CONFIG.IML_URI);
    jQuery.ajaxSetup({async: true});

    setLoading(els.saveBtn, false);

    if (responseObj.status === 200) {
        // Success
        resetForm();
    } else {
        alert("Failed to save data. Error: " + responseObj.message);
    }
}

/**
 * Event Handler: Update Data
 */
function updateData() {
    const formData = getFormData();
    if (formData === null) return; // Validation failed

    // We don't want to update the primary key itself, so we can remove it 
    // or just let it update with the same value. To be safe, we'll keep it.
    
    // Set loading state
    setLoading(els.updateBtn, true);

    const updateRequest = createUPDATERequest(
        CONFIG.CONNECTION_TOKEN,
        JSON.stringify(formData),
        CONFIG.DB_NAME,
        CONFIG.RELATION_NAME,
        currentRecordNo
    );

    jQuery.ajaxSetup({async: false});
    const responseObj = executeCommandAtGivenBaseUrl(updateRequest, CONFIG.BASE_URL, CONFIG.IML_URI);
    jQuery.ajaxSetup({async: true});

    setLoading(els.updateBtn, false);

    if (responseObj.status === 200) {
        // Success
        resetForm();
    } else {
        alert("Failed to update data. Error: " + responseObj.message);
    }
}

/* Helpers */

function enableFormFields() {
    els.fullName.prop("disabled", false);
    els.studentClass.prop("disabled", false);
    els.birthDate.prop("disabled", false);
    els.address.prop("disabled", false);
    els.enrollmentDate.prop("disabled", false);
}

function showStatus(text, className) {
    els.statusBadge
        .text(text)
        .removeClass("hidden status-new status-exist")
        .addClass(className);
}

function hideStatus() {
    els.statusBadge.addClass("hidden");
}

function setLoading(btnQueue, isLoading) {
    if (isLoading) {
        btnQueue.addClass("loading").prop("disabled", true);
    } else {
        btnQueue.removeClass("loading").prop("disabled", false);
    }
}
