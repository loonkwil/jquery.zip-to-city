#!/usr/bin/env php
<?php

$csvSettings = array('delimiter' => ',', 'enclosure' => '"', 'escape' => '\\');

/**
 * @param array $line CSV fajl egy sora
 *
 * @return array
 */
function parseLine($line)
{
    // nem egyertelmu a telepules neve, pl.: Pécs-Hird
    if( count($line) > 2 && !empty($line[2]) ) {
        return null;
    }

    // hibas iranyitoszam
    if( !preg_match('/^[0-9]{4}$/', $line[0]) ) {
        return null;
    }

    return array(
        'zip'  => trim($line[0]),
        'city' => trim($line[1]),
    );
}

/**
 * Adatok kimentese. Az aktualis mappaban, egy map.js fajlba fogja kiirni.
 *
 * @param array $zipCodes
 * @param array $cities
 */
function saveResult($zipCodes, $cities)
{
    function dumpArray($array, $name) {
        $ret = 'var ' . $name . ' = [' . "\n";
        for( $i = 0; $i < count($array); ++$i ) {
            if( is_numeric($array[$i]) ) {
                $ret .= $array[$i];
            }
            else {
                $ret .= "'" . $array[$i] . "'";
            }

            if( $i < count($array) - 1 ) {
                $ret .= ',';
            }
            $ret .= "\n";
        }

        return $ret . '];' . "\n";
    }

    $data = '';
    $data .= dumpArray($zipCodes, 'zipCodes');
    $data .= dumpArray($cities, 'cities');

    file_put_contents('map.js', $data);
}

function main($file)
{
    global $csvSettings;

    if( !is_file($file) ) {
        echo 'Nincs ilyen fájl: ' . $file . "\n";
        return;
    }

    $zipCodes = array();
    $cities = array();

    $fh = fopen($file, 'r');

    if( !$fh ) {
        echo 'Nem tudtam beolvasni a(z) ' . $file . ' fájlt' . "\n";
        return;
    }

    while(
        ( $line = fgetcsv(
            $fh, 0,
            $csvSettings['delimiter'],
            $csvSettings['enclosure'],
            $csvSettings['escape']
        ) ) !== false
    ) {
        $data = parseLine($line);

        if( $data !== null ) {
            $index = array_search($data['zip'], $zipCodes);

            // duplikalt sorok kiszurese
            $haveToSave = (
                $index === false ||
                $cities[$index] !== $data['city']
            );

            if( $haveToSave ) {
                $zipCodes[] = $data['zip'];
                $cities[] = $data['city'];
            }
        }
    }
    fclose($fh);

    saveResult($zipCodes, $cities);
    echo 'irányítószámok: ' . count($zipCodes) . 'db' . "\n";
    echo 'városok: ' . count($cities) . 'db' . "\n";
}

if( count($argv) !== 2 ) {
    echo "Hibás paraméterezés!\n";
}
else {
    main($argv[1]);
}
