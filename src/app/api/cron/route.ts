// app/api/cron-task/route.ts

import { NextResponse } from 'next/server';
import Web3 from 'web3';
import mainABI from '@/json/main.json';
import pool from '@/lib/db';

export async function GET() {
    try {
        const web3 = new Web3("https://data-seed-prebsc-1-s2.bnbchain.org:8545");
        const mainAddress = "0x2dd8e5a2dafa2ae8ed0158db9679878276da407c";
        const contract = new web3.eth.Contract(mainABI, mainAddress);

        const orderId = await contract.methods.orderIds(1).call();
        const orderData = await contract.methods.orders(orderId).call();

        const {
            tokenAddress,
            tokenDecimals,
            ownerAddress,
            totalTokenAdded,
            totalEthRequired,
            perTokenPrice,
            listingexpireTime,
            isTypeCrowdsale,
            isWhitelisted,
            whitelistedAddress,
            tokenPurchased,
            ethRaised,
            status
        } = orderData;

        await pool.query(
            `INSERT INTO orders (
                order_id, token_address, token_decimals, owner_address, 
                total_token_added, total_eth_required, per_token_price, 
                listing_expire_time, is_type_crowdsale, is_whitelisted, 
                whitelisted_address, token_purchased, eth_raised, status
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`,
            [
                orderId,
                tokenAddress,
                parseInt(tokenDecimals),
                ownerAddress,
                BigInt(totalTokenAdded),
                BigInt(totalEthRequired),
                BigInt(perTokenPrice),
                new Date(parseInt(listingexpireTime) * 1000), // Convert timestamp to Date object
                isTypeCrowdsale,
                isWhitelisted,
                whitelistedAddress || null, // Handle null values
                BigInt(tokenPurchased),
                BigInt(ethRaised),
                status
            ]
        );

        return NextResponse.json({ message: 'Cron job executed successfully' });
    } catch (error) {
        console.error('Error executing cron job:', error);
        return NextResponse.json({ message: 'Error executing cron job', error: error.message }, { status: 500 });
    }
}
