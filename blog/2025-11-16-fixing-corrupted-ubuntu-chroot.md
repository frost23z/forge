---
slug: fixing-corrupted-ubuntu-with-chroot
title: Fixing Corrupted Ubuntu with Chroot
description: A step-by-step guide to repair a corrupted Ubuntu system using a live USB and chroot without losing data. Fixes network, driver, and boot issues.
authors: [zayed]
tags: [linux, ubuntu, troubleshooting, system-repair, chroot]
---

I fixed a friend's Ubuntu laptop where networking and touchpad stopped working, and key settings panels had vanished. No backup meant reinstalling wasn't an option.

The cause was likely a botched/interrupted update or a driver conflict that corrupted core system files.

Here's the chroot repair method that saved the system while preserving all user data.

<!--truncate-->

## Prerequisites

- USB drive (8GB+ for modern Ubuntu ISOs)
- Ubuntu live ISO (same release as installed system is best)
- Another computer to create the bootable USB
- Ethernet cable (if WiFi drivers are broken)

:::warning
This method preserves data, but always back up critical files first if possible. In this case, no backup was available.
:::

## TL;DR — Quick Repair

Copy-paste script. Replace `sdXY`, `sdXZ`, and `sdX1` with your actual devices (check with `lsblk -f`). NVMe disks use names like `/dev/nvme0n1p2`.

```bash
# Identify partitions
lsblk -f

# Mount root
sudo mount /dev/sdXY /mnt

# Mount separate /boot and EFI if they exist
sudo mount /dev/sdXZ /mnt/boot
sudo mount /dev/sdX1 /mnt/boot/efi

# Bind essential filesystems
for i in /dev /dev/pts /proc /sys /run; do sudo mount --bind $i /mnt$i; done

# Copy DNS config (not the symlink)
sudo cp --dereference /etc/resolv.conf /mnt/etc/resolv.conf

# Enter chroot
sudo chroot /mnt

# Reinstall desktop environment (or ubuntu-server for servers)
apt update
apt install --reinstall ubuntu-desktop

# Rebuild initramfs and GRUB
update-initramfs -u
update-grub

# Quick health check (optional)
ping -c1 1.1.1.1 && ping -c1 archive.ubuntu.com || echo "Network/DNS not OK"

# Exit and unmount
exit
for i in /run /sys /proc /dev/pts /dev; do sudo umount /mnt$i; done
sudo umount /mnt/boot/efi 2>/dev/null || true
sudo umount /mnt/boot 2>/dev/null || true
sudo umount /mnt/home 2>/dev/null || true
sudo umount /mnt
```

## What Went Wrong

- Networking and touchpad completely broken
- Relevant settings missing from the UI
- Core packages/drivers corrupted
- **Critical constraint:** no backup, all personal files at risk

## The Fix: Live USB + Chroot Repair

The approach: boot from a live USB, mount the broken installation, then use `chroot` to "enter" the system and repair it from inside.

### Step 1: Boot from Live USB

Use a live Ubuntu ISO (same release is preferred). Choose "Try Ubuntu" and open a terminal.

### Step 2: Mount Your Installed System

Find your root partition:

```bash
lsblk -f
```

Mount it:

```bash
sudo mount /dev/sdXY /mnt
```

Replace `sdXY` with your root partition (e.g., `/dev/sda2` or `/dev/nvme0n1p2` for NVMe).

:::tip
For encrypted partitions (LUKS), decrypt first:

```bash
sudo cryptsetup luksOpen /dev/sdXY decrypted_root
sudo mount /dev/mapper/decrypted_root /mnt
```

:::

Mount separate boot/EFI/home partitions if present:

```bash
sudo mount /dev/sdXZ /mnt/boot
sudo mount /dev/sdX1 /mnt/boot/efi
sudo mount /dev/sdXA /mnt/home
```

Bind essential system directories:

```bash
for i in /dev /dev/pts /proc /sys /run; do sudo mount --bind $i /mnt$i; done
```

:::info Why these mounts matter

- `/dev` — Device files (hardware access)
- `/dev/pts` — Pseudo-terminals (for terminal operations)
- `/proc` — Process/kernel interface
- `/sys` — System/hardware information
- `/run` — Runtime data (package management)
  :::

Copy DNS config (use `--dereference` to copy the real file, not the symlink):

```bash
sudo cp --dereference /etc/resolv.conf /mnt/etc/resolv.conf
```

:::warning Important
Skipping bind mounts causes errors. Ensure all five directories are mounted.
:::

### Step 3: Enter the Chroot Environment

Enter your installed system:

```bash
sudo chroot /mnt
```

You're now "inside" your broken installation, using the live system's working kernel and hardware access.

### Step 4: Reinstall Core Packages

Reinstall the desktop metapackage and dependencies:

```bash
apt update
apt install --reinstall ubuntu-desktop
```

For server editions:

```bash
apt install --reinstall ubuntu-server
```

To reinstall all packages (slower but more thorough):

:::caution
This reinstalls every package. Very time-consuming (can take 1-2 hours). Use only as a last resort.
:::

```bash
apt install --reinstall $(dpkg -l | awk '/^ii/{print $2}')
```

Preserves config files while reinstalling binaries.

### Step 5: Fix Bootloader (if needed)

Detect firmware mode:

```bash
if [ -d /sys/firmware/efi ]; then echo "UEFI detected"; else echo "Legacy BIOS detected"; fi
```

**UEFI systems** (ensure `/boot/efi` is mounted):

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ubuntu
update-grub
```

**Legacy BIOS systems:**

```bash
grub-install /dev/sdX   # replace sdX with your disk, not a partition
update-grub
```

### Step 6: Verify and Reboot

Verify critical services:

```bash
# Check network manager
dpkg -l | grep network-manager

# Check recent error logs
journalctl -p err -b -1 | tail -20
```

Exit the chroot and unmount everything:

```bash
exit
for i in /run /sys /proc /dev/pts /dev; do sudo umount /mnt$i; done
sudo umount /mnt/boot/efi 2>/dev/null || true
sudo umount /mnt/boot 2>/dev/null || true
sudo umount /mnt/home 2>/dev/null || true
sudo umount /mnt
sudo reboot
```

System should boot normally with all data preserved.

## What Actually Worked

After following these steps, the laptop came back to life:

- ✅ Network (WiFi + LAN) fully functional
- ✅ Touchpad responding
- ✅ All user files and settings intact

No data was lost.

## Common Issues (and Fixes)

During the repair, these problems might come up:

### Issue 1: "Failed to Fetch" During apt update

Chroot can't reach package mirrors (DNS or network issue).

**Solution:**

```bash
# Copy DNS config if you forgot
sudo cp --dereference /etc/resolv.conf /mnt/etc/resolv.conf
```

If mirrors are broken, fix `/etc/apt/sources.list` inside chroot:

```bash
nano /etc/apt/sources.list
```

Use working mirrors:

```text
deb http://archive.ubuntu.com/ubuntu/ noble main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ noble-updates main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ noble-security main restricted universe multiverse
```

Replace `noble` with your release (`jammy`, `focal`, etc.). Auto-detect codename:

```bash
source /etc/os-release
CODENAME=${UBUNTU_CODENAME:-$VERSION_CODENAME}
sudo tee /etc/apt/sources.list >/dev/null <<EOF
deb http://archive.ubuntu.com/ubuntu/ ${CODENAME} main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ ${CODENAME}-updates main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ ${CODENAME}-security main restricted universe multiverse
EOF
```

Remove stale CD-ROM entries:

```bash
sudo sed -i '/^deb cdrom:/d' /etc/apt/sources.list
```

Then:

```bash
apt clean
apt update
```

### Issue 2: "unable to allocate pty: No such device"

Happens when `/dev/pts` or `/proc` weren't bind mounted properly.

**Solution:**

Exit chroot and unmount:

```bash
exit
sudo umount -lf /mnt/dev/pts 2>/dev/null
sudo umount -lf /mnt/dev 2>/dev/null
sudo umount -lf /mnt/proc 2>/dev/null
sudo umount -lf /mnt/sys 2>/dev/null
sudo umount -lf /mnt/run 2>/dev/null
```

Redo **Step 2** with proper bind mounts:

```bash
for i in /dev /dev/pts /proc /sys /run; do sudo mount --bind $i /mnt$i; done
sudo cp --dereference /etc/resolv.conf /mnt/etc/resolv.conf
sudo chroot /mnt
```

### Issue 3: NVIDIA Driver Errors

NVIDIA drivers like `nvidia-driver-535` can fail due to kernel module issues.

**Solution:**

```bash
# Remove all NVIDIA packages
sudo apt purge 'nvidia-*'
sudo apt autoremove --purge

# Clean and fix package database
sudo apt clean
sudo apt update --fix-missing
sudo apt -f install

# Let Ubuntu auto-detect correct driver
sudo ubuntu-drivers devices
sudo ubuntu-drivers autoinstall

# Rebuild modules
sudo update-initramfs -u
sudo update-grub
```

:::tip Secure Boot and NVIDIA
If Secure Boot is enabled, kernel modules are blocked. Either disable Secure Boot in firmware, or enroll a Machine Owner Key (MOK) when prompted. Reboot and complete MOK enrollment to allow module loading.
:::

### Updating All Drivers

Refresh all hardware drivers:

```bash
# Full system upgrade
apt update
apt full-upgrade

# Intel/AMD GPU drivers and firmware
apt install --reinstall xserver-xorg-video-intel xserver-xorg-video-amdgpu linux-firmware

# NVIDIA (if applicable)
apt purge 'nvidia-*'
ubuntu-drivers autoinstall

# Network and other firmware
apt install --reinstall linux-firmware

# Rebuild all kernel modules
dkms autoinstall
update-initramfs -u
update-grub
```

## When This Method Works (and When It Doesn't)

**This approach works great for:**

- Corrupted system libraries/drivers
- Broken login/display managers
- Need to preserve `/home` and user data

**Don't use this for:**

- Simple app misconfigurations → just edit the config file
- Failing hard drives → focus on data recovery (`ddrescue`)
- Forgotten passwords → use recovery mode

The goal: reinstall Ubuntu's core system while keeping all your personal files untouched.

## Key Takeaways

From this repair experience:

1. **Keep a live USB ready** — You never know when you'll need it
2. **Order matters** — Mount bind points in sequence; use `--dereference` when copying DNS config
3. **Secure Boot gotcha** — Blocks NVIDIA modules; either disable it or enroll a MOK key

This repair took about an hour and saved all the user's data. Sometimes the old-school methods are still the best.

---

_This works for Ubuntu-based systems (Kubuntu, Xubuntu, etc.) — replace `ubuntu-desktop` with `kubuntu-desktop` or `xubuntu-desktop` as needed._
