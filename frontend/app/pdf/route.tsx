"use server";
import { Project } from "@/utils/types";

import React from "react";
import { Page, Text, View, Document, StyleSheet, renderToFile, renderToStream, pdf } from "@react-pdf/renderer";
import { createClient } from "@/utils/supabase/server";
import ReactPDF from "@react-pdf/renderer";
import { NextResponse } from "next/server";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export async function POST(req: Request) {
  const reqBody = await req.json();
  const { project_id } = reqBody;

  const supabase = await createClient();

  const { data, error } = await supabase.from("Projects").select("*").eq('"project_id"', project_id).single();
  return new NextResponse(JSON.stringify({ hello: data }));
  // ReactPDF.render(<MyDocument />, `Downloads/example.pdf`);
}
