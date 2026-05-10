export const officeRules = {
  Library: {
    payment: false,
    customRequirement: true,
  },

  Publication: {
    payment: true,
    customRequirement: true,
  },

  "Student Council": {
    payment: true,
    customRequirement: true,
  },

  "Department Society": {
    payment: true,
    customRequirement: true,
  },

  "Academic Adviser": {
    payment: false,
    customRequirement: true,
  },

  Chairperson: {
    payment: false,
    customRequirement: true,
  },

  Dean: {
    payment: false,
    customRequirement: true,
  },

  "Enrolling Officer": {
    payment: false,
    customRequirement: true,
  },
};

export const currentOfficer = {
  name: "Jonaidah Caris",
  role: "Officer",
  assignedOffice: "Department Society",
};

export const currentOffice =
  officeRules[currentOfficer.assignedOffice];

export const isPaymentOffice = currentOffice.payment;