"use client";

import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaInstagram, FaLinkedin, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { categories } from "@/lib/sections";
import RetroMenu from "./RetroMenu";
import { useEffect, useState } from "react";

export default function HomePage() {
  return <RetroMenu />;
}

