"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, MapPin, Clock, Loader } from 'lucide-react';
import { IRestaurant } from '@/models/Restaurant';
import { useAuth } from "@clerk/nextjs";
import RestaurantsPreview from "@/components/restaurants-preview";
import RestaurantsContent from "@/components/restaurants-content";

const RestaurantsPage = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <RestaurantsPreview />;
  }

  return <RestaurantsContent />;
};

export default RestaurantsPage;
