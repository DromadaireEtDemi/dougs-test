# Module specific variables
# -----------------------------------------------------------------------------
variable "zone_domain" {
  type        = string
  description = "Zone domain, must end with a period."
}

variable "recordsets" {
  type = list(object({
    name    = string
    type    = string
    ttl     = number
    records = optional(list(string), null)
  }))

  description = "List of DNS Record to manage"
  default     = []
}

