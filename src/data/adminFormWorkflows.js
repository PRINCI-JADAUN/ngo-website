export const ADMIN_FORM_WORKFLOWS = [
  {
    id: "all",
    title: "All Forms",
    description: "Browse submissions from all workflows.",
    icon: "fas fa-list",
    types: ["donation", "volunteer", "sponsor", "adoption", "contact"],
  },
  {
    id: "volunteer",
    title: "Volunteer Forms",
    description: "Open the history of volunteer submissions from the homepage section.",
    icon: "fas fa-hands-helping",
    types: ["volunteer"],
  },
  {
    id: "donation",
    title: "Donation Forms",
    description: "Open the history of donation submissions from the homepage section.",
    icon: "fas fa-hand-holding-heart",
    types: ["donation"],
  },
  {
    id: "sponsor",
    title: "Sponsor Forms",
    description: "Open the history of sponsor submissions from the homepage section.",
    icon: "fas fa-paw",
    types: ["sponsor"],
  },
  {
    id: "adoption",
    title: "Adoption Forms",
    description: "Open the history of adoption submissions from the homepage section.",
    icon: "fas fa-home",
    types: ["adoption"],
  },
  {
    id: "contact",
    title: "Contact Forms",
    description: "Open the history of contact form submissions.",
    icon: "fas fa-envelope",
    types: ["contact"],
  },
];

export function getWorkflowById(id) {
  return ADMIN_FORM_WORKFLOWS.find((item) => item.id === id) || ADMIN_FORM_WORKFLOWS[0];
}
