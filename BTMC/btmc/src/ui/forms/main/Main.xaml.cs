using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace btmc
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private enum _TabEnum { BTMC, TERN };
        private _TabEnum _activeTab = _TabEnum.BTMC;

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left || e.ChangedButton == MouseButton.Right)
            {
                try
                {
                    DragMove();
                }
                catch { }
            }
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void TcMain_SectionChanged(object sender, RoutedEventArgs e)
        {
            if (TcMain.SelectedIndex == 0)
            {
                BtmcControl.Visibility = Visibility.Visible;
                TernControl.Visibility = Visibility.Collapsed;
            }
            else if (TcMain.SelectedIndex == 1)
            {
                BtmcControl.Visibility = Visibility.Collapsed;
                TernControl.Visibility = Visibility.Visible;
            }
        }

        private void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            var selectedTab = TcMain.SelectedItem as TabItem;

            if (selectedTab != null)
            {
                switch (selectedTab.Header.ToString())
                {
                    case "BTMC":
                        BtmcControl.ClearFields();
                        break;

                    case "TERN":
                        TernControl.ClearFields();
                        break;
                }
            }
        }

        private void BtnConvert_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                default: break;
                case _TabEnum.BTMC:
                    // Do not implement
                    break;
                case _TabEnum.TERN:
                    // Do not implement
                    break;
            }
        }
    }
}
