#!/usr/bin/expect -f
set timeout 20
log_user 1
set f [open ".sudo_password"]
set password [read $f]
close $f
set command [lindex $argv 0]
if {[llength $argv] > 1} {
    set command [join [lrange $argv 0 end]]
}
send_log "Executing command: $command\n"
spawn sudo -S -- [lrange $argv 0 end]
expect {
  "*?assword*" {
    send_log "Password prompt found. Sending password.\n"
    send "$password\r"
    exp_continue
  }
  eof
}
interact
