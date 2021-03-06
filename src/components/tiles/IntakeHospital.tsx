import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import { LineChart } from './index';

import siteText from 'locale';

import { IntakeHospitalMa } from 'types/data';

const SIGNAAL_WAARDE = 40;

export const IntakeHospital: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.ziekenhuisopnames_per_dag =
    siteText.ziekenhuisopnames_per_dag;
  const data: IntakeHospitalMa | undefined = state?.intake_hospital_ma;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziekenhuis} title={text.title} />

        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            signaalwaarde={SIGNAAL_WAARDE}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.moving_average_hospital}
            id="opnames"
            dataKey="moving_average_hospital"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: SIGNAAL_WAARDE,
              },
              {
                color: '#f35065',
                value: 90,
              },
            ]}
          />
        )}

        {data?.last_value?.moving_average_hospital !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Ziekenhuisopnames per dag"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>
        {data && (
          <>
            <LineChart
              values={data.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={SIGNAAL_WAARDE}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
