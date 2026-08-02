"""
NLP Recommendation — Remediation Recommender
Maps attack categories to MITRE ATT&CK tactics and actionable mitigations.
"""
from typing import List, Dict, Any

# MITRE ATT&CK category → remediation mapping
REMEDIATION_MAP: Dict[str, Dict[str, Any]] = {
    "BruteForce Attack": {
        "mitre_tactic": "Credential Access (T1110)",
        "severity": "HIGH",
        "actions": [
            "Block origin IP at perimeter firewall immediately.",
            "Enforce PasswordAuthentication no in sshd_config.",
            "Enable fail2ban or AWS Security Group rate limiting.",
            "Rotate all passwords for targeted accounts.",
            "Review /var/log/auth.log for scope of compromise.",
        ],
    },
    "Malware Activity": {
        "mitre_tactic": "Execution (T1059)",
        "severity": "CRITICAL",
        "actions": [
            "Isolate affected host from network immediately.",
            "Dump process memory for forensic analysis.",
            "Inspect parent PID tree for lateral movement.",
            "Analyze PowerShell execution logs and script blocks.",
            "Scan with endpoint detection and response (EDR) tool.",
        ],
    },
    "Privilege Escalation": {
        "mitre_tactic": "Privilege Escalation (T1078)",
        "severity": "HIGH",
        "actions": [
            "Revoke elevated policies from the target user account.",
            "Audit IAM CloudTrail session keys.",
            "Rotate all security credentials for affected accounts.",
            "Enable MFA on all administrative accounts.",
            "Review least-privilege policy compliance.",
        ],
    },
    "Reconnaissance Scan": {
        "mitre_tactic": "Discovery (T1046)",
        "severity": "MEDIUM",
        "actions": [
            "Add source IP to firewall drop table.",
            "Ensure non-essential ingress ports are closed.",
            "Verify IDS/IPS signatures are up to date.",
            "Monitor for follow-up exploitation attempts.",
            "Review network segmentation controls.",
        ],
    },
}


def recommend(category: str, entities: List[Dict[str, Any]] = None) -> str:
    """
    Generate a remediation recommendation for the detected attack category.
    Returns a formatted action string.
    """
    entry = REMEDIATION_MAP.get(category)
    if not entry:
        return "No remediation required. Log activity is within normal security parameters."

    actions = entry["actions"]
    tactic = entry["mitre_tactic"]

    # Build the recommendation string
    action_text = " ".join(actions[:3])  # Top 3 actions for API response
    return f"Immediate Action ({tactic}): {action_text}"


def get_full_recommendation(category: str) -> Dict[str, Any]:
    """Return the complete remediation entry including MITRE mapping."""
    return REMEDIATION_MAP.get(category, {
        "mitre_tactic": "N/A",
        "severity": "LOW",
        "actions": ["No specific action required."],
    })
