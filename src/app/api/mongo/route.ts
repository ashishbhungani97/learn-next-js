// app/api/cron-task/route.ts

import { NextResponse } from 'next/server';
import Web3 from 'web3';
import mainABI from '@/json/main.json';
import clientPromise from '@/lib/mongodb'; // MongoDB client

export async function GET() {
    try {
        const web3 = new Web3("https://data-seed-prebsc-1-s2.bnbchain.org:8545");
        const mainAddress = "0x2dd8e5a2dafa2ae8ed0158db9679878276da407c";
        const contract = new web3.eth.Contract(mainABI, mainAddress);

        const orderId = await contract.methods.orderIds(1).call();
        const orderData = await contract.methods.orders(orderId).call();

        // MongoDB connection
        const client = await clientPromise;
        const db = client.db('web3-peer-to-peer'); // Replace 'web3-peer-to-peer' with your database name

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

        // Insert data into MongoDB
        await db.collection('orders').insertOne({
            orderId,
            tokenAddress,
            tokenDecimals: parseInt(tokenDecimals),
            ownerAddress,
            totalTokenAdded: BigInt(totalTokenAdded).toString(),
            totalEthRequired: BigInt(totalEthRequired).toString(),
            perTokenPrice: BigInt(perTokenPrice).toString(),
            listingexpireTime: new Date(parseInt(listingexpireTime) * 1000),
            isTypeCrowdsale,
            isWhitelisted,
            whitelistedAddress: whitelistedAddress || null, // Handle null values
            tokenPurchased: BigInt(tokenPurchased).toString(),
            ethRaised: BigInt(ethRaised).toString(),
            status
        });

        return NextResponse.json({ message: 'Cron job executed successfully' });
    } catch (error) {
        console.error('Error executing cron job:', error);
        return NextResponse.json({ message: 'Error executing cron job', error: error.message }, { status: 500 });
    }
}
