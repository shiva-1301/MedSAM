# Database Export (Full)

Last Updated: 2026-02-14T03:29:41.493Z

## Users

```json
[
  {
    "_id": "698eb969250d069184b6cfd7",
    "fullName": "Admin User",
    "email": "admin@analyx.com",
    "phoneNumber": "1234567890",
    "age": 30,
    "gender": "Other",
    "city": "Admin City",
    "state": "Admin State",
    "bloodGroup": "Unknown",
    "medicalConditions": [],
    "knownDrugAllergies": [],
    "emergencyContactName": "Emergency Contact",
    "emergencyContactPhone": "0987654321",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-02-13T05:40:57.563Z",
    "__v": 0
  },
  {
    "_id": "698ebd0daec0a83a7b38214a",
    "fullName": "Shiva",
    "email": "shiva@gmail.com",
    "phoneNumber": "1234567899",
    "age": 21,
    "gender": "Male",
    "city": "Hyderabad",
    "state": "Telangana",
    "bloodGroup": "A+",
    "medicalConditions": [
      "Diabetes",
      "Other"
    ],
    "otherMedicalConditions": "sighness",
    "knownDrugAllergies": [
      "none"
    ],
    "emergencyContactName": "1234567899",
    "emergencyContactPhone": "1234567899",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-02-13T05:56:29.729Z",
    "__v": 0
  }
]
```

## Pharmacies

```json
[
  {
    "_id": "698ebdadaec0a83a7b382151",
    "fullName": "uday",
    "email": "uday@gmail.com",
    "phoneNumber": "1234567899",
    "pharmacyName": "Uday",
    "licenseNumber": "123456",
    "gstNumber": "",
    "pharmacyAddress": "PLOT 139",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "501510",
    "licenseDocument": "uploads\\licenseDocument-1770962349297-951298311.pdf",
    "workingHours": {
      "monday": {
        "open": "09:00",
        "close": "21:00"
      },
      "tuesday": {
        "open": "09:00",
        "close": "21:00"
      },
      "wednesday": {
        "open": "09:00",
        "close": "21:00"
      },
      "thursday": {
        "open": "09:00",
        "close": "21:00"
      },
      "friday": {
        "open": "09:00",
        "close": "21:00"
      },
      "saturday": {
        "open": "09:00",
        "close": "21:00"
      },
      "sunday": {
        "open": "10:00",
        "close": "18:00"
      }
    },
    "verificationStatus": "approved",
    "role": "pharmacy",
    "isActive": true,
    "createdAt": "2026-02-13T05:59:09.336Z",
    "__v": 0,
    "verifiedAt": "2026-02-13T06:00:30.890Z",
    "verifiedBy": "698eb969250d069184b6cfd7"
  },
  {
    "_id": "698feadfe63a6c33784c5cab",
    "fullName": "Ravi Kumar",
    "email": "medplus1@test.com",
    "phoneNumber": "9000000001",
    "pharmacyName": "MedPlus Central",
    "licenseNumber": "LIC1001",
    "gstNumber": "22ABCDE1234F1Z5",
    "location": {
      "type": "Point",
      "coordinates": [
        78.4867,
        17.385
      ]
    },
    "licenseDocument": "uploads/licenses/medplus-central.pdf",
    "verificationStatus": "approved",
    "role": "pharmacy",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.015Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cba",
    "fullName": "Suresh Reddy",
    "email": "apollo1@test.com",
    "phoneNumber": "9000000002",
    "pharmacyName": "Apollo Pharmacy",
    "licenseNumber": "LIC1002",
    "gstNumber": "22ABCDE1234F1Z6",
    "location": {
      "type": "Point",
      "coordinates": [
        78.4011,
        17.4435
      ]
    },
    "licenseDocument": "uploads/licenses/apollo-pharmacy.pdf",
    "verificationStatus": "approved",
    "role": "pharmacy",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.115Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc9",
    "fullName": "Priya Sharma",
    "email": "care1@test.com",
    "phoneNumber": "9000000003",
    "pharmacyName": "Care Pharmacy",
    "licenseNumber": "LIC1003",
    "gstNumber": "22ABCDE1234F1Z7",
    "location": {
      "type": "Point",
      "coordinates": [
        78.4983,
        17.44
      ]
    },
    "licenseDocument": "uploads/licenses/care-pharmacy.pdf",
    "verificationStatus": "approved",
    "role": "pharmacy",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.181Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd8",
    "fullName": "Arjun Rao",
    "email": "wellness1@test.com",
    "phoneNumber": "9000000004",
    "pharmacyName": "Wellness Meds",
    "licenseNumber": "LIC1004",
    "gstNumber": "22ABCDE1234F1Z8",
    "location": {
      "type": "Point",
      "coordinates": [
        78.4738,
        17.3616
      ]
    },
    "licenseDocument": "uploads/licenses/wellness-meds.pdf",
    "verificationStatus": "approved",
    "role": "pharmacy",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.250Z",
    "__v": 0
  }
]
```

## Medicines

```json
[
  {
    "_id": "698feadfe63a6c33784c5cae",
    "name": "Paracetamol",
    "genericName": "Paracetamol",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 41,
    "price": 143,
    "mrp": 210,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.102Z",
    "updatedAt": "2026-02-14T03:24:15.102Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5caf",
    "name": "Amoxicillin",
    "genericName": "Amoxicillin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 16,
    "price": 64,
    "mrp": 149,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.102Z",
    "updatedAt": "2026-02-14T03:24:15.102Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb0",
    "name": "Ibuprofen",
    "genericName": "Ibuprofen",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 27,
    "price": 23,
    "mrp": 281,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.103Z",
    "updatedAt": "2026-02-14T03:24:15.103Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb1",
    "name": "Cetirizine",
    "genericName": "Cetirizine",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 15,
    "price": 92,
    "mrp": 108,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.104Z",
    "updatedAt": "2026-02-14T03:24:15.104Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb2",
    "name": "Azithromycin",
    "genericName": "Azithromycin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 3,
    "price": 191,
    "mrp": 75,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.104Z",
    "updatedAt": "2026-02-14T03:24:15.104Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb3",
    "name": "Metformin",
    "genericName": "Metformin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 12,
    "price": 46,
    "mrp": 127,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.104Z",
    "updatedAt": "2026-02-14T03:24:15.104Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb4",
    "name": "Aspirin",
    "genericName": "Aspirin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 21,
    "price": 56,
    "mrp": 83,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.105Z",
    "updatedAt": "2026-02-14T03:24:15.105Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb5",
    "name": "Pantoprazole",
    "genericName": "Pantoprazole",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 12,
    "price": 68,
    "mrp": 283,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.105Z",
    "updatedAt": "2026-02-14T03:24:15.105Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb6",
    "name": "Atorvastatin",
    "genericName": "Atorvastatin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 48,
    "price": 74,
    "mrp": 243,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.105Z",
    "updatedAt": "2026-02-14T03:24:15.105Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cb7",
    "name": "Dolo 650",
    "genericName": "Dolo 650",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 29,
    "price": 217,
    "mrp": 237,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cab",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.105Z",
    "updatedAt": "2026-02-14T03:24:15.105Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cbd",
    "name": "Paracetamol",
    "genericName": "Paracetamol",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 9,
    "price": 171,
    "mrp": 202,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.176Z",
    "updatedAt": "2026-02-14T03:24:15.176Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cbe",
    "name": "Amoxicillin",
    "genericName": "Amoxicillin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 16,
    "price": 67,
    "mrp": 163,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.176Z",
    "updatedAt": "2026-02-14T03:24:15.176Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cbf",
    "name": "Ibuprofen",
    "genericName": "Ibuprofen",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 44,
    "price": 76,
    "mrp": 236,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.176Z",
    "updatedAt": "2026-02-14T03:24:15.176Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc0",
    "name": "Cetirizine",
    "genericName": "Cetirizine",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 25,
    "price": 125,
    "mrp": 280,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc1",
    "name": "Azithromycin",
    "genericName": "Azithromycin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 45,
    "price": 110,
    "mrp": 233,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc2",
    "name": "Metformin",
    "genericName": "Metformin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 19,
    "price": 185,
    "mrp": 126,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc3",
    "name": "Aspirin",
    "genericName": "Aspirin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 5,
    "price": 189,
    "mrp": 109,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc4",
    "name": "Pantoprazole",
    "genericName": "Pantoprazole",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 19,
    "price": 107,
    "mrp": 142,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc5",
    "name": "Atorvastatin",
    "genericName": "Atorvastatin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 2,
    "price": 214,
    "mrp": 94,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cc6",
    "name": "Dolo 650",
    "genericName": "Dolo 650",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 0,
    "price": 73,
    "mrp": 122,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cba",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.177Z",
    "updatedAt": "2026-02-14T03:24:15.177Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ccc",
    "name": "Paracetamol",
    "genericName": "Paracetamol",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 21,
    "price": 178,
    "mrp": 104,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.243Z",
    "updatedAt": "2026-02-14T03:24:15.243Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ccd",
    "name": "Amoxicillin",
    "genericName": "Amoxicillin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 46,
    "price": 160,
    "mrp": 191,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.243Z",
    "updatedAt": "2026-02-14T03:24:15.243Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cce",
    "name": "Ibuprofen",
    "genericName": "Ibuprofen",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 20,
    "price": 208,
    "mrp": 239,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.243Z",
    "updatedAt": "2026-02-14T03:24:15.243Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ccf",
    "name": "Cetirizine",
    "genericName": "Cetirizine",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 14,
    "price": 68,
    "mrp": 138,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd0",
    "name": "Azithromycin",
    "genericName": "Azithromycin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 6,
    "price": 44,
    "mrp": 185,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd1",
    "name": "Metformin",
    "genericName": "Metformin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 17,
    "price": 133,
    "mrp": 209,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd2",
    "name": "Aspirin",
    "genericName": "Aspirin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 30,
    "price": 59,
    "mrp": 117,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd3",
    "name": "Pantoprazole",
    "genericName": "Pantoprazole",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 27,
    "price": 114,
    "mrp": 89,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd4",
    "name": "Atorvastatin",
    "genericName": "Atorvastatin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 24,
    "price": 159,
    "mrp": 251,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cd5",
    "name": "Dolo 650",
    "genericName": "Dolo 650",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 43,
    "price": 201,
    "mrp": 56,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cc9",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.244Z",
    "updatedAt": "2026-02-14T03:24:15.244Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cdb",
    "name": "Paracetamol",
    "genericName": "Paracetamol",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 29,
    "price": 163,
    "mrp": 256,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.310Z",
    "updatedAt": "2026-02-14T03:24:15.310Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cdc",
    "name": "Amoxicillin",
    "genericName": "Amoxicillin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 41,
    "price": 83,
    "mrp": 246,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cdd",
    "name": "Ibuprofen",
    "genericName": "Ibuprofen",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 28,
    "price": 176,
    "mrp": 67,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cde",
    "name": "Cetirizine",
    "genericName": "Cetirizine",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 25,
    "price": 168,
    "mrp": 222,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5cdf",
    "name": "Azithromycin",
    "genericName": "Azithromycin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 49,
    "price": 30,
    "mrp": 248,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ce0",
    "name": "Metformin",
    "genericName": "Metformin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 25,
    "price": 166,
    "mrp": 266,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ce1",
    "name": "Aspirin",
    "genericName": "Aspirin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 42,
    "price": 122,
    "mrp": 106,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ce2",
    "name": "Pantoprazole",
    "genericName": "Pantoprazole",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 13,
    "price": 64,
    "mrp": 171,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ce3",
    "name": "Atorvastatin",
    "genericName": "Atorvastatin",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 0,
    "price": 176,
    "mrp": 66,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  },
  {
    "_id": "698feadfe63a6c33784c5ce4",
    "name": "Dolo 650",
    "genericName": "Dolo 650",
    "manufacturer": "Generic Pharma",
    "category": "Tablet",
    "composition": "Sample composition",
    "stockQuantity": 22,
    "price": 129,
    "mrp": 52,
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "dosage": "Twice daily",
    "sideEffects": [
      "Nausea",
      "Headache"
    ],
    "precautions": [
      "Avoid alcohol"
    ],
    "prescriptionRequired": false,
    "pharmacy": "698feadfe63a6c33784c5cd8",
    "isActive": true,
    "createdAt": "2026-02-14T03:24:15.311Z",
    "updatedAt": "2026-02-14T03:24:15.311Z",
    "__v": 0
  }
]
```

## Adherence

```json
[
  {
    "_id": "698f71deb7da7e2782e36fa3",
    "userId": "698ebd0daec0a83a7b38214a",
    "medicineName": "Aspirin",
    "dose": "50",
    "time": "03:21",
    "date": "2026-02-13T00:00:00.000Z",
    "taken": false,
    "notes": "",
    "createdAt": "2026-02-13T18:47:58.934Z",
    "updatedAt": "2026-02-13T18:47:58.934Z",
    "__v": 0
  },
  {
    "_id": "698f71f8b7da7e2782e36fb0",
    "userId": "698ebd0daec0a83a7b38214a",
    "medicineName": "Aspirin",
    "dose": "50",
    "time": "00:23",
    "date": "2026-02-13T00:00:00.000Z",
    "taken": false,
    "notes": "",
    "createdAt": "2026-02-13T18:48:24.648Z",
    "updatedAt": "2026-02-13T18:48:24.648Z",
    "__v": 0
  }
]
```

## Prescriptions

```json
[
  {
    "_id": "698f70fab7da7e2782e36f94",
    "userId": "698ebd0daec0a83a7b38214a",
    "doctorName": "ravi",
    "doctorContact": "12345",
    "hospitalName": "Omni",
    "visitDate": "2026-02-13T00:00:00.000Z",
    "notes": "",
    "fileUrl": "/uploads/prescriptions/prescription-1771008250016-552396700.png",
    "fileType": "png",
    "createdAt": "2026-02-13T18:44:10.027Z",
    "updatedAt": "2026-02-13T18:44:10.027Z",
    "__v": 0
  }
]
```
