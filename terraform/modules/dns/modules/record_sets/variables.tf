variable "zone_domain" {
  type        = string
  description = "Domain of the zone in which the Record Set will be deployed."
}

variable "name" {
  type        = string
  description = "The DNS name this record set will apply to."
}

variable "type" {
  type        = string
  description = "The DNS record set type."
}

variable "records" {
  type        = list(string)
  description = <<EOT
    The string data for the records in this record set whose meaning depends on 
    the DNS type.
  EOT

  nullable = false
  default = []
}

variable "ttl" {
  type        = number
  description = "The time-to-live of this record set (seconds)."

  nullable = false
  default = 60
}
