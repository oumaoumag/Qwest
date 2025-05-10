"use client";

import { ReactNode } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
    Name,
    Identity,
    Address,
    Avatar,
    EthBalance
} from "@coinbase/onchainkit/identity";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Icon } from "../DemoComponents";
import { Button } from "../DemoComponents";

